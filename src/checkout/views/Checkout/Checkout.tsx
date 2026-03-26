"use client";

import { CartListSkeleton } from "@components/skeleton";
import { SkeletonBoundary } from "@components/ui";
import { Summary } from "@/checkout/sections/Summary";
import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/sections/CheckoutForm";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { SummaryListEdit } from "@/components/cart/summary/SummaryListEdit";
import { SummarySkeleton } from "@/components/skeleton/cart/summary/SummarySkeleton";
import { PaymentProcessingScreen } from "@/checkout/sections/PaymentSection/PaymentProcessingScreen";

export const Checkout = () => {
	const { checkout, isLoading } = useCheckout();
	const { isTabletOrBelow } = useDeviceSize();

	return (
		<PaymentProcessingScreen>
			<div className="min-h-screen bg-slate-50/50 pt-8 pb-16">
				<div className="page grid min-h-screen grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-[6fr_4fr]">
					<div className="flex flex-col gap-4">
						<SkeletonBoundary isLoading={isLoading} skeleton={<CartListSkeleton />}>
							<SummaryListEdit {...checkout} />
						</SkeletonBoundary>
						<SkeletonBoundary isLoading={isLoading} skeleton={<CheckoutFormSkeleton />}>
							{checkout?.totalPrice && <CheckoutForm />}
						</SkeletonBoundary>
					</div>
					{!isTabletOrBelow && (
						<div className="sticky top-20 self-start">
							<SkeletonBoundary isLoading={isLoading} skeleton={<SummarySkeleton />}>
								{checkout?.totalPrice && <Summary {...checkout} lines={checkout.lines} />}
							</SkeletonBoundary>
						</div>
					)}
				</div>
			</div>
		</PaymentProcessingScreen>
	);
};
