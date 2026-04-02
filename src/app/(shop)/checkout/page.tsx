import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { invariant } from "ts-invariant";
import * as Checkout from "@/action/checkout";
import { DEFAULT_CHANNEL_SLUG } from "@/constants";
import { generatePageMetadata } from "@/lib/metadata";
import { RootWrapper } from "./pageWrapper";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("checkout");

type CheckoutPage = Promise<{ checkout?: string }>;

const CART_URL = `${DEFAULT_CHANNEL_SLUG}/cart`;

export default async function CheckoutPage({ searchParams }: { searchParams: CheckoutPage }) {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const { checkout: checkoutId } = await searchParams;
	if (!checkoutId) {
		redirect(CART_URL);
	}

	let checkout: Awaited<ReturnType<typeof Checkout.find>> | null = null;
	try {
		checkout = await Checkout.find(checkoutId);
	} catch {
		// Network/API error — redirect to cart WITHOUT clearing the cookie.
		// The cookie is only cleared after confirmed checkout completion
		// (useCheckoutComplete) or stale-checkout recovery in addToCart.
		redirect(CART_URL);
	}

	if (!checkout || checkout.lines.length === 0) {
		// Checkout not found or empty — redirect to cart, do NOT clear cookie.
		// It may have been completed (order placed) and the cookie will be cleaned
		// up by useCheckoutComplete. Clearing here would wipe an active cart.
		redirect(CART_URL);
	}

	return (
		<div className="bg-background min-h-dvh">
			<section className="mx-auto flex min-h-dvh max-w-[1440px] flex-col px-4 md:px-8 lg:px-10">
				<RootWrapper />
			</section>
		</div>
	);
}
