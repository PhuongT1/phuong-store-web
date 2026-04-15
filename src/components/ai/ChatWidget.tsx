"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Trash2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";

export function ChatWidget() {
	const [open, setOpen] = useState(false);
	const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (open && bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, open]);

	return (
		<div className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11">
			{/* Panel — floats above the button via absolute positioning */}
			{open && (
				<div
					className={cn(
						"absolute right-0 bottom-full z-10 mb-3 flex w-80 flex-col rounded-2xl shadow-xl",
						"border-border bg-card border",
						"sm:w-96"
					)}
					style={{ maxHeight: "520px" }}
				>
					{/* Header */}
					<div className="bg-primary flex items-center justify-between rounded-t-2xl px-4 py-3">
						<div className="flex items-center gap-2">
							<MessageCircle size={18} className="text-primary-foreground" />
							<span className="text-primary-foreground text-sm font-semibold">Trợ lý Phương Store</span>
						</div>
						<div className="flex items-center gap-1">
							{messages.length > 0 && (
								<button
									onClick={clearMessages}
									className="text-primary-foreground/70 hover:text-primary-foreground rounded-full p-1"
									aria-label="Xóa hội thoại"
								>
									<Trash2 size={15} />
								</button>
							)}
							<button
								onClick={() => setOpen(false)}
								className="text-primary-foreground/70 hover:text-primary-foreground rounded-full p-1"
								aria-label="Đóng chat"
							>
								<X size={18} />
							</button>
						</div>
					</div>

					{/* Messages */}
					<div
						className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
						style={{ minHeight: 0, maxHeight: "360px" }}
					>
						{messages.length === 0 && (
							<p className="text-muted-foreground text-center text-xs">
								Xin chào! Tôi có thể giúp gì cho bạn hôm nay?
							</p>
						)}
						{messages.map((m, i) => (
							<ChatMessageBubble key={i} message={m} />
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
									<span className="animate-pulse">Đang trả lời...</span>
								</div>
							</div>
						)}
						{error && <p className="text-destructive text-center text-xs">{error}</p>}
						<div ref={bottomRef} />
					</div>

					{/* Input */}
					<div className="px-4 pb-4">
						<ChatInput onSend={sendMessage} isLoading={isLoading} />
					</div>
				</div>
			)}

			{/* Trigger button — no fixed positioning, parent ChatLauncherStack handles that */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"flex h-full w-full shrink-0 items-center justify-center rounded-full p-0 shadow-lg",
					"bg-primary text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
				)}
				aria-label="Mở trợ lý AI"
			>
				{open ? (
					<X size={17} className="sm:h-[18px] sm:w-[18px]" />
				) : (
					<MessageCircle size={17} className="sm:h-[18px] sm:w-[18px]" />
				)}
			</button>
		</div>
	);
}
