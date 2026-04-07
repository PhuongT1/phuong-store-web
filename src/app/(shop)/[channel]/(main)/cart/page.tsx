import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { getCheckoutIdCookie } from "@/action";
import * as Checkout from "@/action/checkout";
import { MainProductLayout } from "@/components/layouts";
import { DEFAULT_CHANNEL_SLUG } from "@/constants";
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

	// Saleor confirmed the checkout no longer exists — redirect to the clear route
	// which deletes the cookie (cookie mutations only allowed in Route Handlers).
	if (checkout === null && checkoutId) {
		redirect(`/api/checkout/clear?next=${DEFAULT_CHANNEL_SLUG}/cart`);
	}

	const isEmptyCart = !checkout || checkout.lines.length < 1;

	return (
		<MainProductLayout title={!isEmptyCart ? "Giỏ hàng" : undefined}>
			{isEmptyCart ? (
				<section className="flex flex-col items-center py-20">
					<div className="flex justify-center">
						<ImageItem width={440} height={440} alt={"Empty"} src="/images/empty_cart.png" />
					</div>
					<p className="text-muted-foreground mt-4 mb-8 text-sm">Chưa có sản phẩm nào trong giỏ hàng</p>
					<ButtonLink href="/" isKeepHref className="w-52 rounded-none font-semibold tracking-wide uppercase">
						Về trang chủ
					</ButtonLink>
				</section>
			) : (
				<form className="flex flex-col gap-6 pb-40 md:flex-row md:items-start md:pb-0 lg:gap-8">
					<CheckoutItems checkout={checkout as TCheckout} checkoutId={checkoutId} />
					<CheckoutSubmit checkout={checkout as TCheckout} checkoutId={checkoutId} />
				</form>
			)}
		</MainProductLayout>
	);
}
