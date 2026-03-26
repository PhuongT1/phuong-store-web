"use client";

import { useTransition } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
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
			className="text-sm text-neutral-500 hover:text-neutral-900"
			onClick={() => {
				if (isPending) return;
				startTransition(() => deleteLineFromCheckout({ lineId, checkoutId }));
			}}
			aria-disabled={isPending}
		>
			{/* {isPending ? "Removing" : "Remove"} */}
			<TrashIcon width={24} height={24} />
		</button>
	);
};
