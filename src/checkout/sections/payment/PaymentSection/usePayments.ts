import { usePaymentGatewaysInitialize } from "@/checkout/sections/payment/PaymentSection/usePaymentGatewaysInitialize";

export const usePayments = () => {
	const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();
	return { fetching, availablePaymentGateways };
};
