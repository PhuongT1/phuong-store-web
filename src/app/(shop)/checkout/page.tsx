import { invariant } from "ts-invariant";
import { RootWrapper } from "./pageWrapper";

export const metadata = {
	title: "Checkout · Saleor Storefront example"
};

type CheckoutPage = Promise<{ checkout?: string; order?: string }>;

export default async function CheckoutPage({ searchParams }: { searchParams: CheckoutPage }) {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const { checkout, order } = await searchParams;
	if (!checkout && !order) {
		return null;
	}

	return (
		<div className="min-h-dvh bg-white">
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col md:p-8">
				<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
			</section>
		</div>
	);
}
