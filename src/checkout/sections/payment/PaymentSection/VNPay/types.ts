import { type FC } from "react";

export const vnpayGatewayId = "vnpay.payment.app";
export type VNPayGatewayId = typeof vnpayGatewayId;

export interface VNPayConfig {
	id: string;
	name: string;
	currencies: string[];
	config: Array<{
		field: string;
		value: string;
	}>;
}

export interface VNPayComponentProps {
	config: VNPayConfig;
}
