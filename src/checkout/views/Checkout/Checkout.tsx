"use client";

import { CheckoutForm, CheckoutFormSkeleton } from "@/checkout/sections/CheckoutForm";
import { Summary } from "@/checkout/sections/order-summary/Summary";
import { PaymentProcessingScreen } from "@/checkout/sections/payment/PaymentSection/PaymentProcessingScreen";
import { SummaryListEdit } from "@/components/cart/summary/SummaryListEdit";
import { SummarySkeleton } from "@/components/skeleton/cart/summary/SummarySkeleton";
import { useUser } from "@/checkout/hooks/useUser";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { CartListSkeleton } from "@components/skeleton";
import { SkeletonBoundary } from "@components/ui";

export const Checkout = () => {
	const { checkout, isLoading: checkoutLoading } = useCheckout();
	const { isInitialLoad: userInitialLoad } = useUser();
	const { isTabletOrBelow } = useDeviceSize();

	// Cart list (items) skeleton: needs checkout data with a valid id.
	// Treat missing id as loading — prevents SummaryListEdit from receiving an
	// empty checkout and resetting its RHF form to zero items.
	const isCartLoading = checkoutLoading || !checkout?.id;

	// CheckoutForm skeleton: needs BOTH checkout AND user data on first load.
	// isInitialLoad is true only for the very first SWR fetch (data===undefined).
	// This covers both guest (CurrentUser returns {me: null} quickly) and logged-in
	// users (CurrentUser returns user + addresses, slightly slower).
	// Does NOT re-trigger on background revalidation → no skeleton flash on refocus.
	const isFormLoading = checkoutLoading || userInitialLoad;

	return (
		<PaymentProcessingScreen>
			<div className="bg-background min-h-screen py-4 sm:py-6">
				<div className="page grid min-h-screen grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-[minmax(0,6fr)_minmax(320px,4fr)] lg:gap-x-8 lg:gap-y-6">
					<div className="flex flex-col gap-4">
						{!isTabletOrBelow && (
							<SkeletonBoundary isLoading={isCartLoading} skeleton={<CartListSkeleton />}>
								<SummaryListEdit {...checkout} />
							</SkeletonBoundary>
						)}
						<SkeletonBoundary isLoading={isFormLoading} skeleton={<CheckoutFormSkeleton />}>
							{checkout?.totalPrice && <CheckoutForm />}
						</SkeletonBoundary>
					</div>
					{!isTabletOrBelow && (
						<div className="sticky top-[calc(var(--header-height)+1.25rem)] self-start">
							<SkeletonBoundary isLoading={isCartLoading} skeleton={<SummarySkeleton />}>
								{checkout?.totalPrice && <Summary {...checkout} lines={checkout.lines} />}
							</SkeletonBoundary>
						</div>
					)}
				</div>
			</div>
		</PaymentProcessingScreen>
	);
};
