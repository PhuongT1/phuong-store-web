import { useCallback, useEffect, useRef, useState } from "react";
import { useCheckoutPolling } from "@/checkout/hooks/useCheckoutPolling";
import { useUser } from "@/checkout/hooks/useUser";
import { useMutation } from "@/checkout/lib/useMutation";
import { getHostedGatewayPresentation } from "@/checkout/sections/payment/PaymentSection/hostedGateways";
import { vnpayGatewayId } from "@/checkout/sections/payment/PaymentSection/VNPay/types";
import {
	useTransactionInitializeState,
	useCheckoutTransactionStateStore
} from "@/checkout/state/checkoutTransactionStateStore";
import { useCheckoutValidationActions } from "@/checkout/state/checkoutValidationStateStore";
import { useCheckoutUpdateState, useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";
import { type TransactionInitialize, type TransactionInitializeFullMutation, type TransactionInitializeFullMutationVariables, TransactionInitializeFullDocument } from "@/gql/graphql";
import { useTransactionProcess } from "@/hooks/checkout/mutations/useTransaction";
import { useCheckoutComplete } from "@/hooks/checkout/queries/useCheckoutComplete";
import { useCheckout } from "@hooks/checkout";
import { processTransactionData } from "./processTransactionData";
import { usePayButtonValidation } from "./usePayButtonValidation";

export const usePayButton = () => {
	const { transaction, paymentSectionSelectedId } = useTransactionInitializeState();
	const { actions } = useCheckoutTransactionStateStore();
	const { authenticated } = useUser();
	const { checkout } = useCheckout();
	const [, transactionInitialize] = useMutation<TransactionInitializeFullMutation, TransactionInitializeFullMutationVariables>(TransactionInitializeFullDocument);

	const checkoutUpdateState = useCheckoutUpdateState();
	const { setSubmitInProgress, setShouldRegisterUser, setLoadingCheckout } = useCheckoutUpdateStateActions();
	const { validateAllForms } = useCheckoutValidationActions();

	const submitGuardRef = useRef(false);
	const paymentFlowTokenRef = useRef(0);
	const [showProcessingModal, setShowProcessingModal] = useState(false);
	const [pollingEnabled, setPollingEnabled] = useState(false);
	const [currentTransactionId, setCurrentTransactionId] = useState<string | undefined>();
	const [hostedPayment, setHostedPayment] = useState<{
		gatewayId: string;
		transactionId: string;
		url: string;
	} | null>(null);

	const { onCheckoutComplete } = useCheckoutComplete();
	const [isCreatingOrder, setIsCreatingOrder] = useState(false);

	const { trigger } = useTransactionProcess({
		onSuccess: () => setLoadingCheckout(false),
		onError: () => {
			resetVNPayRetryState();
			setLoadingCheckout(false);
		}
	});

	const resetVNPayRetryState = useCallback(() => {
		paymentFlowTokenRef.current += 1;
		setPollingEnabled(false);
		setShowProcessingModal(false);
		setCurrentTransactionId(undefined);
		setHostedPayment(null);
		actions.clearTransaction(vnpayGatewayId);
	}, [actions]);

	useEffect(() => {
		const handleHostedPaymentMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			const payload = event.data as
				| {
						source?: string;
						type?: "PAYMENT_SUCCESS" | "PAYMENT_ERROR" | "PAYMENT_CANCELLED";
						data?: Record<string, unknown>;
				  }
				| undefined;

			if (!payload || payload.source !== "hosted-payment-return" || !payload.type) return;

			const transactionId = hostedPayment?.transactionId ?? currentTransactionId;
			if (!transactionId) return;

			setHostedPayment(null);

			if (payload.type === "PAYMENT_SUCCESS") {
				setCurrentTransactionId(transactionId);
				setPollingEnabled(true);
				setShowProcessingModal(true);
				void trigger({
					id: transactionId,
					data: { vnpParams: payload.data && "vnpParams" in payload.data ? payload.data.vnpParams : payload.data }
				});
				return;
			}

			resetVNPayRetryState();
			setLoadingCheckout(false);
			void import("sonner").then(({ toast }) => {
				if (payload.type === "PAYMENT_CANCELLED") {
					toast.info("Bạn đã hủy thanh toán VNPay. Có thể thử lại bất kỳ lúc nào.");
				} else {
					toast.error(
						typeof payload.data?.errorMessage === "string"
							? payload.data.errorMessage
							: "Thanh toán không thành công. Vui lòng thử lại."
					);
				}
			});
		};

		window.addEventListener("message", handleHostedPaymentMessage);
		return () => window.removeEventListener("message", handleHostedPaymentMessage);
	}, [currentTransactionId, hostedPayment?.transactionId, resetVNPayRetryState, setLoadingCheckout, trigger]);

	const { isPolling, timeElapsed } = useCheckoutPolling({
		enabled: pollingEnabled,
		checkoutId: checkout?.id ?? "",
		transactionId: currentTransactionId,
		interval: 2000,
		timeout: 60000,
		onOrderCreated: (orderId) => {
			resetVNPayRetryState();
			setLoadingCheckout(false);
			void import("sonner").then(({ toast }) => toast.success("Thanh toán thành công!"));
			window.location.href =
				orderId !== "unknown" ? `/order-confirmation?order=${orderId}` : "/account/orders";
		},
		onTimeout: () => {
			resetVNPayRetryState();
			setLoadingCheckout(false);
			void import("sonner").then(({ toast }) =>
				toast.error("Chưa xác nhận được thanh toán. Bạn có thể thử thanh toán lại hoặc kiểm tra đơn hàng.")
			);
		},
		onError: () => undefined
	});

	// Build options object for processTransactionData util
	const makeTxOpts = (flowToken?: number) => ({
		isFlowActive: () => (flowToken ? paymentFlowTokenRef.current === flowToken : true),
		onSetTransactionId: setCurrentTransactionId,
		onActionRequired: ({ transactionId, paymentUrl }: { transactionId: string; paymentUrl: string }) => {
			if (flowToken && paymentFlowTokenRef.current !== flowToken) return;
			setCurrentTransactionId(transactionId);
			setHostedPayment({ gatewayId: paymentSectionSelectedId, transactionId, url: paymentUrl });
			setLoadingCheckout(false);
		},
		onComplete: () => {
			if (flowToken && paymentFlowTokenRef.current !== flowToken) return;
			// transactionInitialize already reported a non-action-required result
			// (e.g. COD CHARGE_REQUEST). Skip transactionProcess and complete
			// the checkout directly, showing a brief loading overlay.
			if (!checkout?.id) {
				setLoadingCheckout(false);
				return;
			}
			setIsCreatingOrder(true);
			void onCheckoutComplete({
				checkoutId: checkout.id,
				onError: () => {
					if (flowToken && paymentFlowTokenRef.current !== flowToken) return;
					setIsCreatingOrder(false);
					setLoadingCheckout(false);
				}
			});
		},
		onLoadingEnd: () => {
			if (flowToken && paymentFlowTokenRef.current !== flowToken) return;
			setLoadingCheckout(false);
		},
		onResetRetryState: resetVNPayRetryState
	});

	const handleSubmit = useCallback(async () => {
		if (submitGuardRef.current) {
			return;
		}
		submitGuardRef.current = true;
		const flowToken = paymentFlowTokenRef.current + 1;
		paymentFlowTokenRef.current = flowToken;

		const isVNPay = paymentSectionSelectedId === vnpayGatewayId;

		try {
			if (isVNPay && !transaction?.[vnpayGatewayId]) {
				if (!checkout?.id) {
					setLoadingCheckout(false);
					return;
				}
				try {
					const result = await transactionInitialize({
						checkoutId: checkout.id,
						paymentGateway: { id: vnpayGatewayId, data: {} }
					});
					const txData = result.data?.transactionInitialize;
					if (result.error || !txData) {
						resetVNPayRetryState();
						void import("sonner").then(({ toast }) =>
							toast.error(`Lỗi khởi tạo VNPay: ${result.error instanceof Error ? result.error.message : "Không nhận được phản hồi"}`)
						);
						setLoadingCheckout(false);
						return;
					}
					if (txData.errors?.length) {
						resetVNPayRetryState();
						const msg = txData.errors.map((e) => e.message ?? e.code).join(", ");
						void import("sonner").then(({ toast }) => toast.error(`Lỗi VNPay: ${msg}`));
						setLoadingCheckout(false);
						return;
					}
					const eventType = txData.transactionEvent?.type;
					if (eventType === "AUTHORIZATION_FAILURE" || eventType === "CHARGE_FAILURE") {
						resetVNPayRetryState();
						void import("sonner").then(({ toast }) =>
							toast.error(`Lỗi VNPay: ${txData.transactionEvent?.message ?? "Lỗi không xác định"}`)
						);
						setLoadingCheckout(false);
						return;
					}
					actions.setUpdateState({ [vnpayGatewayId]: txData as TransactionInitialize });
					processTransactionData(txData as TransactionInitialize, makeTxOpts(flowToken));
				} catch (err) {
					resetVNPayRetryState();
					void import("sonner").then(({ toast }) =>
						toast.error(`Lỗi hệ thống: ${err instanceof Error ? err.message : String(err)}`)
					);
					setLoadingCheckout(false);
				}
				return;
			}

			if (isVNPay && transaction?.[vnpayGatewayId]) {
				const txData = transaction[vnpayGatewayId];
				if (!txData) {
					resetVNPayRetryState();
					void import("sonner").then(({ toast }) =>
						toast.error("Không thể khởi tạo thanh toán VNPay. Vui lòng thử lại.")
					);
					setLoadingCheckout(false);
					return;
				}
				processTransactionData(txData, makeTxOpts(flowToken));
				return;
			}

			// Non-VNPay (COD, etc.)
			const txData = transaction?.[paymentSectionSelectedId];
			if (!txData) {
				void import("sonner").then(({ toast }) =>
					toast.error("Không thể khởi tạo thanh toán. Vui lòng đợi và thử lại.")
				);
				setLoadingCheckout(false);
				return;
			}
			processTransactionData(txData, makeTxOpts(flowToken));
		} finally {
			submitGuardRef.current = false;
		}
	}, [
		actions,
		checkout?.id,
		paymentSectionSelectedId,
		resetVNPayRetryState,
		setLoadingCheckout,
		transaction,
		transactionInitialize,
		trigger
	]);

	usePayButtonValidation({
		onHandleSubmit: handleSubmit,
	});

	const handleHostedPaymentOpenChange = useCallback(
		(open: boolean) => {
			if (open) return;
			if (!hostedPayment) return;
			resetVNPayRetryState();
			setLoadingCheckout(false);
			void import("sonner").then(({ toast }) =>
				toast.info("Đã đóng cửa sổ thanh toán. Bạn có thể chọn lại phương thức và đặt hàng.")
			);
		},
		[hostedPayment, resetVNPayRetryState, setLoadingCheckout]
	);

	const handleOpenHostedPaymentExternal = useCallback(() => {
		if (!hostedPayment?.url) return;
		window.open(hostedPayment.url, "_blank", "noopener,noreferrer");
	}, [hostedPayment?.url]);

	const handleCancelProcessing = useCallback(() => {
		resetVNPayRetryState();
		setIsCreatingOrder(false);
		setLoadingCheckout(false);
		void import("sonner").then(({ toast }) =>
			toast.info("Đã dừng chờ xác nhận thanh toán. Bạn có thể đặt lại đơn.")
		);
	}, [resetVNPayRetryState, setLoadingCheckout]);

	const handleClickOrder = () => {
		setSubmitInProgress(true);
		setShouldRegisterUser(true);
		validateAllForms(authenticated);
	};

	return {
		isPolling,
		timeElapsed,
		showProcessingModal,
		setShowProcessingModal,
		setPollingEnabled,
		setLoadingCheckout,
		checkoutUpdateState,
		handleClickOrder,
		handleCancelProcessing,
		isCreatingOrder,
		hostedPayment,
		hostedPaymentPresentation: getHostedGatewayPresentation(hostedPayment?.gatewayId),
		handleHostedPaymentOpenChange,
		handleOpenHostedPaymentExternal
	};
};
