import React from "react";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { ContactSkeleton } from "@/checkout/sections/auth/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection";
import { Separator } from "@/components/ui";
import { Card } from "@/components/ui/Card";

export const CheckoutFormSkeleton = () => (
	<Card className="border-card-elevated-border bg-card-elevated shadow-card-elevated flex w-full flex-col border p-4 backdrop-blur-sm sm:p-6 md:rounded-2xl lg:p-8">
		<ContactSkeleton />
		<Separator />
		<AddressSectionSkeleton />
		<Separator />
		<DeliveryMethodsSkeleton />
		<Separator />
		<PaymentSectionSkeleton />
	</Card>
);
