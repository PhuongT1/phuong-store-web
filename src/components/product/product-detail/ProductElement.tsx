// Re-export the new ProductCard component with backward-compatible names.
// ProductCard is the canonical name; ProductElement is kept for existing imports.
export { ProductCard, ProductElement } from "../product-card/ProductCard";

import { cn } from "@/lib/utils";

// Legacy price sub-components — used in MainDetail.tsx and CheckoutItems.tsx

type PriceUndiscountedElementProps = {
	priceUndiscounted: string;
	onSale?: boolean | null;
} & React.HTMLAttributes<HTMLSpanElement>;

type DiscountedElementProps = {
	discounted: string;
	onSale?: boolean | null;
} & React.HTMLAttributes<HTMLSpanElement>;

const UndiscountedElement = ({
	priceUndiscounted,
	onSale = true,
	className,
	...rest
}: PriceUndiscountedElementProps) => (
	<span
		{...rest}
		className={cn("text-[12px] font-normal text-gray-400 line-through", { hidden: !onSale }, className)}
	>
		{priceUndiscounted}
	</span>
);

const DiscountedElement = ({ discounted, onSale = true, className, ...rest }: DiscountedElementProps) => (
	<span
		{...rest}
		className={cn(
			"inline-flex items-center rounded-sm bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-500",
			{ hidden: !onSale },
			className
		)}
	>
		-{discounted}
	</span>
);

export { UndiscountedElement, DiscountedElement };
