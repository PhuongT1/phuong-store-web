"use client";

import { useCheckoutLine } from "@/hooks/checkout/queries/useCheckout";
import { ImageItem } from "@components/ui";
import { ButtonLink } from "./ButtonLink";
import { CheckoutItems } from "./CheckoutItems";
import { CheckoutSubmit } from "./CheckoutSubmit";

interface CartContentProps {
	checkoutId: string;
}

export function CartContent({ checkoutId }: CartContentProps) {
	const { checkout, mutate, isLoading } = useCheckoutLine({ id: checkoutId || null });

	// While SWR is doing the initial fetch (no cached data yet), show nothing.
	// This avoids the "flash of empty cart" caused by lastGoodCheckout being null
	// on the very first render before any data has arrived.
	if (isLoading && !checkout) {
		return null;
	}

	const isEmptyCart = !checkout || checkout.lines.length < 1;

	if (isEmptyCart) {
		return (
			<section className="flex flex-col items-center py-20">
				<div className="flex justify-center">
					<ImageItem width={440} height={440} alt={"Empty"} src="/images/empty_cart.png" />
				</div>
				<p className="text-muted-foreground mt-4 mb-8 text-sm">Chưa có sản phẩm nào trong giỏ hàng</p>
				<ButtonLink href="/" isKeepHref className="w-52 rounded-none font-semibold tracking-wide uppercase">
					Về trang chủ
				</ButtonLink>
			</section>
		);
	}

	return (
		<form className="flex flex-col gap-6 pb-40 md:flex-row md:items-start md:pb-0 lg:gap-8">
			<CheckoutItems checkout={checkout} checkoutId={checkoutId} onDeleted={() => void mutate()} />
			<CheckoutSubmit checkout={checkout} checkoutId={checkoutId} />
		</form>
	);
}
