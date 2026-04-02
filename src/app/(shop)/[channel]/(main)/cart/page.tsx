import { type Metadata } from "next";
import { getCheckoutIdCookie, removeCheckoutIdCookie } from "@/action";
import * as Checkout from "@/action/checkout";
import { MainProductLayout } from "@/components/layouts";
import { type Checkout as TCheckout } from "@/gql/graphql";
import { generatePageMetadata } from "@/lib/metadata";
import { ImageItem } from "@components/ui";
import { ButtonLink } from "./ButtonLink";
import { CheckoutItems } from "./CheckoutItems";
import { CheckoutSubmit } from "./CheckoutSubmit";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("cart");

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
	// params is used for type-safety; destructure to satisfy Next.js 15 async params
	void (await params);
	const checkoutId = await getCheckoutIdCookie();

	// checkout is:
	//   CheckoutType — valid, has items
	//   null         — Saleor confirmed checkout does not exist (completed or expired)
	//   undefined    — network/API error; state unknown, keep cookie and show empty cart
	//
	// Per project rule: clear the cookie ONLY when Saleor explicitly confirms the checkout
	// is gone (checkout === null). On network/auth errors (throws → checkout === undefined),
	// keep the cookie so the user's items return when the error resolves.
	let checkout: Awaited<ReturnType<typeof Checkout.find>> | undefined = undefined;
	try {
		checkout = await Checkout.find(checkoutId);
	} catch {
		// Treat as unknown state: show empty cart, keep cookie for next reload retry.
	}

	// Saleor confirmed the checkout no longer exists — clear the stale cookie so the
	// next add-to-cart creates a fresh checkout (no stale-checkout recovery needed).
	if (checkout === null && checkoutId) {
		await removeCheckoutIdCookie();
	}

	const isEmptyCart = !checkout || checkout.lines.length < 1;

	return (
		<MainProductLayout title={!isEmptyCart ? "Giỏ hàng" : undefined}>
			{isEmptyCart ? (
				<section className="text-center">
					<div className="flex justify-center">
						<ImageItem width={600} height={600} alt={"Empty"} src="/images/empty_cart.png" />
					</div>
					<p className="text-muted-foreground mb-4 text-sm">Chưa có sản phẩm nào trong giỏ hàng</p>
					<ButtonLink href="/products" className="w-auto">
						Về trang chủ
					</ButtonLink>
				</section>
			) : (
				<form className="flex flex-col gap-4 md:flex-row">
					<CheckoutItems checkout={checkout as TCheckout} checkoutId={checkoutId} />
					<CheckoutSubmit checkout={checkout as TCheckout} checkoutId={checkoutId} />
				</form>
			)}
		</MainProductLayout>
	);
}
