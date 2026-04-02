import React from "react";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { ContactSkeleton } from "@/checkout/sections/auth/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection";
import { Separator } from "@/components/ui";
import { Card } from "@/components/ui/Card";

export const CheckoutFormSkeleton = () => (
	<Card className="bg-card flex w-full flex-col border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 md:rounded-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
		<ContactSkeleton />
		<Separator />
		<AddressSectionSkeleton />
		<Separator />
		<DeliveryMethodsSkeleton />
		<Separator />
		<PaymentSectionSkeleton />
	</Card>
);
