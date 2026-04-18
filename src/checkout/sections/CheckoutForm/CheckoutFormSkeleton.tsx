import React from "react";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { ContactSkeleton } from "@/checkout/sections/auth/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection";
import { Separator } from "@/components/ui";
import { Card } from "@/components/ui/Card";

export const CheckoutFormSkeleton = () => (
	<Card className="flex w-full flex-col border-0 bg-transparent p-2 shadow-none backdrop-blur-sm md:rounded-2xl min-[1025px]:border min-[1025px]:border-card-elevated-border min-[1025px]:bg-card-elevated min-[1025px]:p-6 min-[1025px]:shadow-card-elevated xl:p-8">
		<ContactSkeleton />
		<Separator />
		<AddressSectionSkeleton />
		<Separator />
		<DeliveryMethodsSkeleton />
		<Separator />
		<PaymentSectionSkeleton />
	</Card>
);
