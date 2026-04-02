export const dummyPaymentGatewayId = "saleor.dummy-payment-app";
export type DummyPaymentGatewayId = typeof dummyPaymentGatewayId;

export interface DummyPaymentConfig {
	id: string;
	name: string;
}

export interface DummyPaymentComponentProps {
	config: DummyPaymentConfig;
}
