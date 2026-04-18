import { type Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { OrderConfirmationWrapper } from "./OrderConfirmationWrapper";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("orderConfirmation");

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
			<section className="mx-auto flex min-h-dvh max-w-(--container-max-w) flex-col px-4 md:px-8 lg:px-10">
				<OrderConfirmationWrapper />
			</section>
		</div>
	);
}
