"use client";

import { useState, useCallback } from "react";

export type ChatRole = "user" | "model";

export interface ChatMessage {
	role: ChatRole;
	text: string;
}

interface GeminiHistoryPart {
	role: ChatRole;
	parts: { text: string }[];
}

export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toGeminiHistory = useCallback((msgs: ChatMessage[]): GeminiHistoryPart[] => {
		return msgs.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
	}, []);

	const sendMessage = useCallback(
		async (text: string) => {
			const userMsg: ChatMessage = { role: "user", text };
			const nextMessages = [...messages, userMsg];
			setMessages(nextMessages);
			setIsLoading(true);
			setError(null);

			// Add empty model message that will be filled by stream
			setMessages((prev) => [...prev, { role: "model", text: "" }]);

			try {
				const res = await fetch("/api/ai/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						message: text,
						history: toGeminiHistory(messages)
					})
				});

				if (!res.ok) {
					const data = (await res.json()) as { error?: string };
					throw new Error(data.error ?? "Lỗi không xác định");
				}

				const reader = res.body?.getReader();
				if (!reader) throw new Error("Không nhận được stream từ server.");

				const decoder = new TextDecoder();
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					setMessages((prev) => {
						const last = prev[prev.length - 1];
						return [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
					});
				}
			} catch (err) {
				// Remove the empty model message on error
				setMessages((prev) => (prev[prev.length - 1]?.text === "" ? prev.slice(0, -1) : prev));
				const msg = err instanceof Error ? err.message : "Trợ lý AI tạm thời không phản hồi.";
				setError(msg);
			} finally {
				setIsLoading(false);
			}
		},
		[messages, toGeminiHistory]
	);

	const clearMessages = useCallback(() => {
		setMessages([]);
		setError(null);
	}, []);

	return { messages, isLoading, error, sendMessage, clearMessages };
}
