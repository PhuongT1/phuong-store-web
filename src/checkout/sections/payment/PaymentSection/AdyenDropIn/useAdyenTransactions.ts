import { useCallback, useMemo } from "react";
import { camelCase } from "lodash-es";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { useMutation } from "@/checkout/lib/useMutation";
import { clearQueryParams, replaceUrl } from "@/checkout/lib/utils/url";
import {
	type TransactionInitializeFullMutationVariables,
	type TransactionProcessMutationVariables,
	TransactionInitializeFullDocument,
	TransactionProcessDocument
} from "@/gql/graphql";
import { apiErrorMessages } from "../errorMessages";
import { usePaymentProcessingScreen } from "../PaymentProcessingScreen";
import { adyenErrorMessages } from "./errorMessages";
import {
	type AdyenPaymentResponse,
	type AdyenTransactionInitializeResponse,
	type AdyenTransactionProcessResponse
} from "./types";
// @ts-expect-error Adyen types not installed
import type DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";

interface AdyenTransactionsInput {
	adyenCheckoutSubmitParams: { state: { data: unknown }; component: DropinElement } | null;
	showCustomErrors: (errors: Array<{ message: string }>) => void;
	setCurrentTransactionId: (id: string | undefined | null) => void;
}

export const useAdyenTransactions = ({
	adyenCheckoutSubmitParams,
	showCustomErrors,
	setCurrentTransactionId
}: AdyenTransactionsInput) => {
	const { getMessageByErrorCode } = useErrorMessages(adyenErrorMessages);
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);
	const { setIsProcessingPayment } = usePaymentProcessingScreen();
	const [, transactionInitialize] = useMutation(TransactionInitializeFullDocument);
	const [, transactionProcess] = useMutation(TransactionProcessDocument);
	const { onCheckoutComplete } = useCheckoutComplete();

	const handlePaymentResult = useCallback(
		({
			paymentResponse,
			transaction
		}: {
			paymentResponse: AdyenPaymentResponse;
			transaction: MightNotExist<{ id: string }>;
		}) => {
			const { action, resultCode } = paymentResponse;

			if (transaction) {
				setCurrentTransactionId(transaction.id);
				replaceUrl({ query: { transaction: transaction.id } });
			}

			if (action) {
				adyenCheckoutSubmitParams?.component.handleAction(action);
			}

			switch (resultCode) {
				case "Authorised":
					adyenCheckoutSubmitParams?.component.setStatus("success");
					void onCheckoutComplete();
					return;
				case "Error":
					adyenCheckoutSubmitParams?.component.setStatus("error");
					showCustomErrors([{ message: "There was an error processing your payment." }]);
					return;
				case "Refused":
					setCurrentTransactionId(undefined);
					adyenCheckoutSubmitParams?.component.setStatus("ready");
					showCustomErrors([{ message: getMessageByErrorCode(camelCase(paymentResponse.refusalReason)) }]);
					return;
			}
		},
		[adyenCheckoutSubmitParams?.component, getMessageByErrorCode, onCheckoutComplete, setCurrentTransactionId, showCustomErrors]
	);

	const onTransactionInitialize = useSubmit<
		TransactionInitializeFullMutationVariables,
		typeof transactionInitialize
	>(
		useMemo(
			() => ({
				onSubmit: transactionInitialize,
				onError: () => {
					showCustomErrors([{ message: apiErrorMessages.somethingWentWrong }]);
					adyenCheckoutSubmitParams?.component.setStatus("ready");
				},
				extractCustomErrors: (result) => {
					const adyenData = result?.data?.transactionInitialize?.data as
						| { errors?: unknown[] }
						| undefined;
					return adyenData?.errors ?? [];
				},
				onSuccess: async ({ data }) => {
					if (!data) {
						showCustomErrors([{ message: apiErrorMessages.somethingWentWrong }]);
						return;
					}
					const { transaction } = data;
					const adyenData = data.data as AdyenTransactionInitializeResponse | null;
					if (!transaction || !adyenData) return;
					void handlePaymentResult({ paymentResponse: adyenData.paymentResponse, transaction });
				}
			}),
			[adyenCheckoutSubmitParams?.component, commonErrorMessages.somethingWentWrong, handlePaymentResult, showCustomErrors, transactionInitialize]
		)
	);

	const onTransactionProcess = useSubmit<TransactionProcessMutationVariables, typeof transactionProcess>(
		useMemo(
			() => ({
				onSubmit: transactionProcess,
				onError: () => {
					setIsProcessingPayment(false);
					clearQueryParams("transaction");
					setCurrentTransactionId(null);
					showCustomErrors([{ message: apiErrorMessages.somethingWentWrong }]);
					adyenCheckoutSubmitParams?.component.setStatus("ready");
				},
				extractCustomErrors: (result) => {
					const adyenData = result?.data?.transactionProcess?.data as
						| { errors?: unknown[] }
						| undefined;
					return adyenData?.errors ?? [];
				},
				onSuccess: ({ data }) => {
					if (!data?.data) {
						showCustomErrors([{ message: apiErrorMessages.somethingWentWrong }]);
						return;
					}
					const { transaction } = data;
					const { paymentDetailsResponse } = data.data as AdyenTransactionProcessResponse;
					clearQueryParams("transaction");
					setCurrentTransactionId(null);
					handlePaymentResult({ paymentResponse: paymentDetailsResponse, transaction });
				}
			}),
			[adyenCheckoutSubmitParams?.component, commonErrorMessages.somethingWentWrong, handlePaymentResult, setCurrentTransactionId, setIsProcessingPayment, showCustomErrors, transactionProcess]
		)
	);

	return { onTransactionInitialize, onTransactionProcess };
};
