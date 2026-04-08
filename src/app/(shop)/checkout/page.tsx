import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { invariant } from "ts-invariant";
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

	return (
		<div className="bg-background min-h-dvh">
			<section className="mx-auto flex min-h-dvh max-w-(--container-max-w) flex-col px-4 md:px-8 lg:px-10">
				<RootWrapper />
			</section>
		</div>
	);
}
