"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteLineFromCheckout } from "./actions";

type Props = {
	lineId: string;
	checkoutId: string;
};

export const DeleteLineButton = ({ lineId, checkoutId }: Props) => {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			type="button"
			aria-label="Xóa sản phẩm"
			aria-disabled={isPending}
			className={cn(
				"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150",
				"text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
				isPending && "cursor-not-allowed opacity-40"
			)}
			onClick={() => {
				if (isPending) return;
				startTransition(() => deleteLineFromCheckout({ lineId, checkoutId }));
			}}
		>
			<Trash2 size={15} strokeWidth={2} />
		</button>
	);
};
