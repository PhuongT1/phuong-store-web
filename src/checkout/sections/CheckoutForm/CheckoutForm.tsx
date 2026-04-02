import { Suspense, useState } from "react";
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
import { Separator } from "@components/ui";
import { Typography } from "@components/ui";

export const CheckoutForm = () => {
	useCheckoutAddressSync();
	const t = useTranslations("checkout");
	const { user } = useUser();
	const { checkout } = useCheckout();
	const { passwordResetToken } = getQueryParams();

	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);

	return (
		<Card className="bg-card-elevated border-card-elevated-border shadow-card-elevated flex w-full flex-col items-end border p-6 backdrop-blur-sm sm:p-8 md:rounded-2xl">
			<div className="w-full">
				{/* ── Contact section header — only shown when not authenticated ── */}
				{!user && (
					<div className="mb-4 flex items-center gap-2.5">
						<div className="bg-icon-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-(--radius)">
							<SquareUser className="text-info h-3.5 w-3.5" strokeWidth={1.5} />
						</div>
						<Typography variant="title" className="mb-0!">
							{t("customerInfo")}
						</Typography>
					</div>
				)}

				{/* ── Signed-in user info pill (when authenticated) ── */}
				{user && (
					<div className="bg-muted mb-4 flex items-center gap-2.5 rounded-(--radius) px-3 py-2">
						<div className="bg-icon-bg flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
							<SquareUser className="text-info h-3 w-3" strokeWidth={1.5} />
						</div>
						<span className="text-muted-foreground text-sm font-medium">{user.email}</span>
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
