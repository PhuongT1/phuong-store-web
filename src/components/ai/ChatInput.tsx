"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const schema = z.object({
	message: z.string().min(1).max(500)
});

type FormValues = z.infer<typeof schema>;

interface ChatInputProps {
	onSend: (text: string) => void;
	isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid }
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { message: "" },
		mode: "onChange"
	});

	const onSubmit = (data: FormValues) => {
		onSend(data.message);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="border-border flex items-center gap-2 border-t pt-3">
			<input
				{...register("message")}
				placeholder="Nhắn tin cho tôi..."
				disabled={isLoading}
				className={cn(
					"border-border bg-input text-foreground flex-1 rounded-full border px-4 py-2 text-sm",
					"placeholder:text-muted-foreground focus:ring-primary/50 focus:ring-2 focus:outline-none",
					"disabled:opacity-50"
				)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						void handleSubmit(onSubmit)();
					}
				}}
			/>
			<button
				type="submit"
				disabled={isLoading || !isValid}
				className={cn(
					"bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
					"transition-opacity hover:opacity-90 disabled:opacity-40"
				)}
				aria-label="Gửi tin nhắn"
			>
				<SendHorizonal size={16} />
			</button>
		</form>
	);
}
