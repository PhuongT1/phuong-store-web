import { type ChatMessage as ChatMessageType } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
	message: ChatMessageType;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
	const isUser = message.role === "user";
	// Don't render an empty model bubble — the "Đang trả lời..." indicator handles that state.
	if (!isUser && !message.text) return null;
	return (
		<div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
			<div
				className={cn(
					"max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
					isUser
						? "bg-primary text-primary-foreground rounded-br-sm"
						: "bg-muted text-foreground rounded-bl-sm"
				)}
			>
				{message.text}
			</div>
		</div>
	);
}
