"use client";

import { Suspense } from "react";
import { OrderConfirmation, OrderConfirmationSkeleton } from "@/checkout/views/OrderConfirmation";

export const OrderConfirmationWrapper = () => {
	return (
		<Suspense fallback={<OrderConfirmationSkeleton />}>
			<OrderConfirmation />
		</Suspense>
	);
};
