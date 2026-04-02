/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

// @ts-expect-error Adyen types not installed
import { type CardElementData } from "@adyen/adyen-web/dist/types/components/Card/types";
// @ts-expect-error Adyen types not installed
import { type PaymentResponse } from "@adyen/adyen-web/dist/types/components/types";
// @ts-expect-error Adyen types not installed
import { type PaymentMethodsResponse } from "@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse/types";
// @ts-expect-error Adyen types not installed
import type DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";

export const adyenGatewayId = "app.saleor.adyen";
export type AdyenGatewayId = typeof adyenGatewayId;

// because it's defined to these in the docs but it's a string in the response type
type AdyenResultCode = "Authorised" | "Error" | "Pending" | "PresentToShopper" | "Refused" | "Received";

export interface AdyenGatewayInitializePayload {
	paymentMethodsResponse: PaymentMethodsResponse;
	clientKey: string;
	environment: string;
}

export interface AdyenPaymentResponse extends Omit<PaymentResponse, "resultCode"> {
	resultCode: AdyenResultCode;
	refusalReason?: string;
}

export interface AdyenTransactionInitializeResponse {
	paymentResponse: AdyenPaymentResponse;
}

export interface AdyenTransactionProcessResponse {
	paymentDetailsResponse: AdyenPaymentResponse;
}

// -------

export type ApplePayCallback = <T>(value: T) => void;

export type AdyenCheckoutInstanceState = {
	isValid?: boolean;
	data: CardElementData & Record<string, any>;
};

export type AdyenCheckoutInstanceOnSubmit = (
	state: AdyenCheckoutInstanceState,
	component: DropinElement
) => Promise<void> | void;

export type AdyenCheckoutInstanceOnAdditionalDetails = (
	state: AdyenCheckoutInstanceState,
	component: DropinElement
) => Promise<void> | void;
