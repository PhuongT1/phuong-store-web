import {
	type AdyenGatewayId,
	type AdyenGatewayInitializePayload,
} from "@/checkout/sections/payment/PaymentSection/AdyenDropIn/types";
import { type PaymentGatewayConfig } from "@/gql/graphql";
import { type CashDeliveryGatewayId } from "./CashDelivery/types";
import { type DummyPaymentGatewayId } from "./DummyPayment/types";
import { type StripeGatewayId } from "./StripeElements/types";
import { type VNPayGatewayId } from "./VNPay/types";

export type PaymentGatewayId = AdyenGatewayId | StripeGatewayId | CashDeliveryGatewayId | VNPayGatewayId | DummyPaymentGatewayId;

export type ParsedAdyenGateway = ParsedPaymentGateway<AdyenGatewayId, AdyenGatewayInitializePayload>;
export type ParsedStripeGateway = ParsedPaymentGateway<StripeGatewayId, {}>;

export type ParsedPaymentGateways = ReadonlyArray<ParsedAdyenGateway | ParsedStripeGateway>;

export interface ParsedPaymentGateway<ID extends string, TData extends Record<string, any>>
	extends Omit<PaymentGatewayConfig, "data" | "id"> {
	data: TData;
	id: ID;
}

export type PaymentStatus = "paidInFull" | "overpaid" | "none" | "authorized";
