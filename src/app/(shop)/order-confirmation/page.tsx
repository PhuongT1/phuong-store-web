import { type Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { OrderConfirmationWrapper } from "./OrderConfirmationWrapper";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("checkout");

type OrderConfirmationPageParams = Promise<{ order?: string }>;

export default async function OrderConfirmationPage({
	searchParams
}: {
	searchParams: OrderConfirmationPageParams;
}) {
	const { order } = await searchParams;
	if (!order) return null;

	return (
		<div className="bg-background min-h-dvh">
			<section className="mx-auto flex min-h-dvh max-w-[1440px] flex-col px-4 md:px-8 lg:px-10">
				<OrderConfirmationWrapper />
			</section>
		</div>
	);
}
