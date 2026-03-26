import { Suspense, useState } from "react";
import { Card } from "@ui/Card";
import { Typography } from "@components/ui";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { Contact } from "@/checkout/sections/Contact";
import { DeliveryMethods } from "@/checkout/sections/DeliveryMethods";
import { ContactSkeleton } from "@/checkout/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { CollapseSection } from "@/checkout/sections/CheckoutForm/CollapseSection";
import { UserShippingAddressSection } from "@/checkout/sections/UserShippingAddressSection";
import { GuestShippingAddressSection } from "@/checkout/sections/GuestShippingAddressSection";
import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
import { useUser } from "@/checkout/hooks/useUser";
import { PayButton } from "@/checkout/sections/PayButton";
import { useCheckoutAddressSync } from "@/checkout/hooks/useCheckoutAddressSync";

export const CheckoutForm = () => {
	useCheckoutAddressSync();
	const { user } = useUser();
	const { checkout } = useCheckout();
	const { passwordResetToken } = getQueryParams();

	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);

	return (
		<Card className="flex w-full flex-col items-end border-none bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 md:rounded-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
			<div className="w-full">
				<Typography variant="title">Thông tin khách hàng</Typography>
				<Suspense fallback={<ContactSkeleton />}>
					<Contact setShowOnlyContact={setShowOnlyContact} />
				</Suspense>
				{checkout?.isShippingRequired && (
					<Suspense fallback={<AddressSectionSkeleton />}>
						<CollapseSection collapse={showOnlyContact}>
							<div data-testid="shippingAddressSection">
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
