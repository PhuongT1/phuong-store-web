import React from "react";
import { PaymentMethods } from "./PaymentMethods";
import { Divider } from "@/checkout/components/Divider";
import { Typography } from "@/components/ui";

export const PaymentSection = () => {
	return (
		<>
			<Divider />
			<div className="py-4" data-testid="paymentMethods">
				<Typography variant="title">Phương thức thanh toán</Typography>
				<PaymentMethods />
			</div>
		</>
	);
};
