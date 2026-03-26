import { ShoppingCart } from "lucide-react";
import { LinkWithChannel } from "@components/navigation/LinkWithChannel";
import * as Checkout from "@/action/checkout";
import { cn } from "@/lib/utils";
import { getCheckoutIdCookie } from "@/action";

export const CartNavItem = async () => {
	const checkoutId = await getCheckoutIdCookie();
	const checkout = checkoutId ? await Checkout.find(checkoutId) : null;

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return (
		<LinkWithChannel
			isKeepHref
			href={`/checkout?checkout=${checkoutId}`}
			className={cn(
				"group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
				"hover:bg-primary/10 active:bg-primary/20"
			)}
			data-testid="CartNavItem"
		>
			<div className="relative">
				<ShoppingCart
					strokeWidth={2}
					className="text-foreground group-hover:text-primary h-5 w-5 transition-colors"
				/>
				{lineCount > 0 && (
					<div
						className={cn(
							"bg-price ring-background absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] leading-none font-black text-white shadow-sm ring-2"
						)}
					>
						{lineCount}
					</div>
				)}
			</div>
			<span className="sr-only">{lineCount} items in cart</span>
		</LinkWithChannel>
	);
};
