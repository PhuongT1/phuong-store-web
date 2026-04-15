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
import { PayButton } from "@/checkout/sections/payment/PayButton";
import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { Separator, Typography } from "@components/ui";
import { SummaryListEdit } from "@/components/cart/summary/SummaryListEdit";
import { Summary } from "@/checkout/sections/order-summary/Summary";
import { useDeviceSize } from "@/hooks/useDeviceSize";

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
		<Card className="border-card-elevated-border bg-card-elevated shadow-card-elevated flex w-full flex-col items-end border p-4 backdrop-blur-sm sm:p-6 md:rounded-2xl lg:p-8">
			<div className="w-full">
				{/* ── Mobile Cart Items (top of checkout form) ── */}
				{isTabletOrBelow && checkout && (
					<div className="mb-2 sm:mb-4">
						<SummaryListEdit {...checkout} classNameCard="p-0 border-none shadow-none bg-transparent" />
						<Separator className="mt-4" />
					</div>
				)}

				{/* ── Contact section header — only shown when not authenticated ── */}
				{!user && (
					<div className="mb-2 flex items-center gap-2.5 sm:mb-4">
						<div className="bg-icon-bg border-border/60 flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius) border">
							<SquareUser className="text-info h-5 w-5" strokeWidth={1.5} />
						</div>
						<Typography variant="title" className="mb-0!">
							{t("customerInfo")}
						</Typography>
					</div>
				)}

				{/* ── Signed-in user info pill (when authenticated) ── */}
				{user && (
					<div className="bg-input border-border mb-2 flex items-center gap-2.5 rounded-(--radius) border px-3 py-2.5 sm:mb-4">
						<SquareUser className="text-muted-foreground h-4 w-4 shrink-0" strokeWidth={1.5} />
						<span className="text-foreground/80 text-sm">{user.email}</span>
					</div>
				)}

				<Suspense fallback={<ContactSkeleton />}>
					<Contact setShowOnlyContact={setShowOnlyContact} />
				</Suspense>
				{checkout?.isShippingRequired && (
					<Suspense fallback={<AddressSectionSkeleton />}>
						<CollapseSection collapse={showOnlyContact}>
							<Separator className="my-4" />
							<div data-testid="shippingAddressSection" className="pb-2">
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
						<div className="py-2 sm:py-4">
							<Summary
								{...checkout}
								lines={checkout.lines}
								editable={true}
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
