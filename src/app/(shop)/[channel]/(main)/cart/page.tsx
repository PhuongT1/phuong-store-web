import { type Metadata } from "next";
import { getCheckoutIdCookie } from "@/action";
import { MainProductLayout } from "@/components/layouts";
import { generatePageMetadata } from "@/lib/metadata";
import { CartContent } from "./CartContent";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("cart");

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
	// params is used for type-safety; destructure to satisfy Next.js 15 async params
	void (await params);
	const checkoutId = await getCheckoutIdCookie();

	// All checkout fetching happens client-side via SWR in CartContent.
	// This avoids the old SSR path where a transient auth race could cause
	// Checkout.find() to return null → redirect to /api/checkout/clear → cookie deleted.
	return (
		<MainProductLayout title="Giỏ hàng">
			<CartContent checkoutId={checkoutId} />
		</MainProductLayout>
	);
}
