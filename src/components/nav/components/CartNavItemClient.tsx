"use client";

import { ShoppingCart } from "lucide-react";
import { notify } from "@/components/ui/Sonner";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@components/navigation/LinkWithChannel";

type Props = {
	lineCount: number;
	checkoutId: string;
};

const iconClass = cn(
	"group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
	"hover:bg-accent active:scale-95"
);

const CartIcon = ({ lineCount }: { lineCount: number }) => (
	<div className="relative">
		<ShoppingCart
			strokeWidth={1.5}
			className="text-foreground group-hover:text-primary h-6 w-6 transition-colors"
		/>
		{lineCount > 0 && (
			<div className="bg-price ring-background absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] leading-none font-black text-price-foreground shadow-sm ring-2">
				{lineCount}
			</div>
		)}
	</div>
);

export const CartNavItemClient = ({ lineCount, checkoutId }: Props) => {
	if (lineCount === 0) {
		return (
			<button
				type="button"
				className={iconClass}
				data-testid="CartNavItem"
				onClick={() => notify.warning("Giỏ hàng của bạn đang trống")}
				aria-label="Giỏ hàng trống"
			>
				<CartIcon lineCount={0} />
				<span className="sr-only">0 items in cart</span>
			</button>
		);
	}

	return (
		<LinkWithChannel
			isKeepHref
			href={`/checkout?checkout=${checkoutId}`}
			className={iconClass}
			data-testid="CartNavItem"
		>
			<CartIcon lineCount={lineCount} />
			<span className="sr-only">{lineCount} items in cart</span>
		</LinkWithChannel>
	);
};
