import { Suspense, useEffect, useState } from "react";
import { Card } from "@ui/Card";
import { SquareUser } from "lucide-react";
import { useTranslations } from "next-intl";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { useCheckoutAddressSync } from "@/checkout/hooks/useCheckoutAddressSync";
import { useUser } from "@/checkout/hooks/useUser";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { GuestShippingAddressSection } from "@/checkout/sections/address/GuestShippingAddressSection";
import { UserShippingAddressSection } from "@/checkout/sections/address/UserShippingAddressSection";
import { Contact } from "@/checkout/sections/auth/Contact";
import { ContactSkeleton } from "@/checkout/sections/auth/Contact/ContactSkeleton";
import { CollapseSection } from "@/checkout/sections/CheckoutForm/CollapseSection";
import { DeliveryMethods } from "@/checkout/sections/DeliveryMethods";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { Summary } from "@/checkout/sections/order-summary/Summary";
import { PayButton } from "@/checkout/sections/payment/PayButton";
import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection";
import { SummaryListEdit } from "@/components/cart/summary/SummaryListEdit";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { Separator, Typography } from "@components/ui";

export const CheckoutForm = () => {
	useCheckoutAddressSync();
	const t = useTranslations("checkout");
	const { user } = useUser();
	const { checkout } = useCheckout();
	const { isTabletOrBelow } = useDeviceSize();

	const [showOnlyContact, setShowOnlyContact] = useState(false);

	useEffect(() => {
		const { passwordResetToken } = getQueryParams();
		if (passwordResetToken) {
			setShowOnlyContact(true);
		}
	}, []);

	return (
		<Card className="flex w-full flex-col items-end border-0 bg-transparent p-2 shadow-none md:rounded-2xl min-[1025px]:border min-[1025px]:border-card-elevated-border min-[1025px]:bg-card-elevated min-[1025px]:p-6 min-[1025px]:shadow-card-elevated xl:p-8">
			<div className="w-full">
				{/* ── Mobile Cart Items (top of checkout form) ── */}
					{isTabletOrBelow && checkout && (
						<div className="mb-3 min-[1025px]:mb-4">
							<SummaryListEdit {...checkout} compact classNameCard="p-0 border-none shadow-none bg-transparent" />
							<Separator className="mt-4 min-[1025px]:mt-4" />
						</div>
					)}

				{/* ── Contact section header — only shown when not authenticated ── */}
				{!user && (
					<div className="mb-3 flex items-center gap-2.5 min-[1025px]:mb-4">
						<div className="bg-secondary/42 flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius)">
							<SquareUser className="text-info h-5 w-5" strokeWidth={1.5} />
						</div>
						<Typography variant="title" className="mb-0! text-[15px] font-semibold tracking-tight sm:text-base">
							{t("customerInfo")}
						</Typography>
					</div>
				)}

				{/* ── Signed-in user info pill (when authenticated) ── */}
				{/* Removed due to UX feedback: users felt the email block unnecessarily separated from address details */}

				<Suspense fallback={<ContactSkeleton />}>
					<Contact setShowOnlyContact={setShowOnlyContact} />
				</Suspense>
				{checkout?.isShippingRequired && (
					<Suspense fallback={<AddressSectionSkeleton />}>
						<CollapseSection collapse={showOnlyContact}>
							<Separator className="my-4 min-[1025px]:my-4" />
							<div data-testid="shippingAddressSection" className="pb-4 min-[1025px]:pb-2">
								{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
							</div>
						</CollapseSection>
					</Suspense>
				)}
				<Suspense fallback={<DeliveryMethodsSkeleton />}>
					<DeliveryMethods collapsed={showOnlyContact} />
				</Suspense>

					{isTabletOrBelow && checkout && (
						<CollapseSection collapse={showOnlyContact}>
							<div className="pt-4 pb-3 min-[1025px]:py-4">
								<Summary
									{...checkout}
									lines={checkout.lines}
									editable={true}
									compact
									classNameCard="p-0 border-none shadow-none bg-transparent"
								/>
							</div>
						</CollapseSection>
				)}

				<Suspense fallback={<PaymentSectionSkeleton />}>
					<CollapseSection collapse={showOnlyContact}>
						<PaymentSection />
					</CollapseSection>
				</Suspense>
				<PayButton />
			</div>
		</Card>
	);
};
