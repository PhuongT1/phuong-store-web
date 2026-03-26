import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { type TransactionInitializeData } from "@/checkout/graphql";
import { type PaymentGatewayId } from "@/checkout/sections/PaymentSection/types";

export type TransactionInitializePayment = Partial<Record<PaymentGatewayId, TransactionInitializeData>>;

export interface CheckoutTransactionStateStore {
	transaction?: TransactionInitializePayment;
	paymentSectionSelectedId: PaymentGatewayId;
	actions: {
		setUpdateState: (transaction: TransactionInitializePayment) => void;
		setPaymentSectionSelectedId: (paymentGatewayId: PaymentGatewayId) => void;
	};
}

export const useCheckoutTransactionStateStore = createWithEqualityFn<CheckoutTransactionStateStore>(
	(set) => ({
		paymentSectionSelectedId: "saleor.app.cashDelivery",
		actions: {
			setUpdateState: (transaction) =>
				set((state) => ({ ...state, transaction: { ...state.transaction, ...transaction } })),
			setPaymentSectionSelectedId: (paymentSectionSelectedId) =>
				set((state) => ({ ...state, paymentSectionSelectedId }))
		}
	}),
	shallow
);

export const useTransactionInitializeState = () => {
	const { actions, ...data } = useCheckoutTransactionStateStore();
	return data;
};
