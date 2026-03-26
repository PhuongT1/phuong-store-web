import { useForm, type UseFormReturn } from "react-hook-form";
import { cashDeliveryGatewayId } from "./CashDelivery/types";

interface PaymentSectionFormData {
	paymentSectionSelectedId: string | undefined;
}

export const usePaymentSectionForm = (): UseFormReturn<PaymentSectionFormData> => {
	const defaultFormData: PaymentSectionFormData = {
		paymentSectionSelectedId: cashDeliveryGatewayId
	};

	return useForm<PaymentSectionFormData>({
		defaultValues: defaultFormData,
		mode: "onTouched"
	});
};
