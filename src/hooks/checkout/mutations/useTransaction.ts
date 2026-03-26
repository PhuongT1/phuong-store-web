"use client";

import useSWRMutation from "swr/mutation";
import { useFetcher } from "../../useFetcher";
import { useCheckoutComplete } from "../queries/useCheckoutComplete";
import { useCheckout } from "../queries/useCheckout";
import { TransactionProcessDocument, type TransactionProcessMutationVariables } from "@/gql/graphql";
import { CONFIG } from "@/constants";

type TransactionProcessProps = {
	onSuccess?: () => void;
	onError?: () => void;
};

const useTransactionProcess = ({ onSuccess, onError }: TransactionProcessProps) => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();
	const { onCheckoutComplete } = useCheckoutComplete();
	const { fetcherGraphQL } = useFetcher();

	const fetchData = async (_key: string, { arg }: { arg: TransactionProcessMutationVariables }) =>
		fetcherGraphQL([TransactionProcessDocument, arg]);

	return useSWRMutation(CONFIG.CHECKOUT_KEY.transactionProcessKey, fetchData, {
		onSuccess: (data) => {
			// Check if there are errors
			if (data.transactionProcess?.errors && data.transactionProcess.errors.length > 0) {
				const errors = data.transactionProcess.errors;
				void import("sonner").then(({ toast }) => {
					toast.error("Giao dịch không thành công: " + (errors?.[0]?.message || "Vui lòng thử lại."));
				});
				onError?.();
				return;
			}

			// Check transaction event type
			const eventType = data.transactionProcess?.transactionEvent?.type;
			const transactionData = data.transactionProcess?.data;

			if (eventType === "CHARGE_ACTION_REQUIRED" || eventType === "AUTHORIZATION_ACTION_REQUIRED") {
				if (transactionData && typeof transactionData === "object") {
					const paymentUrl = (transactionData as any).paymentUrl || (transactionData as any).payment_url;
					if (paymentUrl) {
						window.location.href = paymentUrl;
						return;
					}
				}
				void import("sonner").then(({ toast }) => {
					toast.error("Cần xác thực thanh toán nhưng không tìm thấy URL.");
				});
				onError?.();
				return;
			}

			if (eventType === "CHARGE_REQUEST" || eventType === "AUTHORIZATION_REQUEST") {
				void import("sonner").then(({ toast }) => {
					toast.info("Đang xử lý thanh toán...");
				});
				// Could poll for status or wait for webhook
				// For now, treat as success and complete checkout
			}

			if (eventType === "CHARGE_FAILURE" || eventType === "AUTHORIZATION_FAILURE") {
				void import("sonner").then(({ toast }) => {
					toast.error(
						"Thanh toán thất bại: " +
							(data.transactionProcess?.transactionEvent?.message || "Vui lòng thử lại.")
					);
				});
				onError?.();
				return;
			}

			// If payment successful, complete checkout
			if (
				eventType === "CHARGE_SUCCESS" ||
				eventType === "AUTHORIZATION_SUCCESS" ||
				!eventType // No event type means success for COD
			) {
				onSuccess?.();
				void onCheckoutComplete({ checkoutId, onError });
			}
		},
		onError: (_error) => {
			void import("sonner").then(({ toast }) => {
				toast.error("Lỗi hệ thống: Không thể xử lý giao dịch. Vui lòng thử lại.");
			});
			onError?.();
		}
	});
};

export { useTransactionProcess };
