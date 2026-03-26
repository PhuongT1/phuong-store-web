import React from "react";
import { ContactSkeleton } from "@/checkout/sections/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
import { Divider } from "@/checkout/components";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { Card } from "@/components/ui/Card";

export const CheckoutFormSkeleton = () => (
	<Card className="flex w-full flex-col border-none bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 md:rounded-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
		<ContactSkeleton />
		<Divider />
		<AddressSectionSkeleton />
		<Divider />
		<DeliveryMethodsSkeleton />
		<Divider />
		<PaymentSectionSkeleton />
	</Card>
);
