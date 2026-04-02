import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
	url: string;
	alt: string;
	className?: string;
};

/**
 * Shared thumbnail used for order line items across:
 * - /account/orders list (OrderListItem)
 * - /account/orders/[id] detail page
 * Consistent sizing: 80×80 (sm: 96×96), border, rounded-lg, contained image.
 */
export function OrderLineThumbnail({ url, alt, className }: Props) {
	return (
		<div
			className={cn(
				"border-border bg-card relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border sm:h-24 sm:w-24",
				className
			)}
		>
			<Image src={url} alt={alt} fill className="object-contain p-2" sizes="96px" />
		</div>
	);
}
