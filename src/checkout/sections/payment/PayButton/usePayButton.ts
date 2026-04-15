import { useCallback, useRef, useState } from "react";
import { useCheckoutPolling } from "@/checkout/hooks/useCheckoutPolling";
import { useUser } from "@/checkout/hooks/useUser";
import { useMutation } from "@/checkout/lib/useMutation";
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

	const preopenedPopupRef = useRef<Window | null>(null);
	const submitGuardRef = useRef(false);
	const [showProcessingModal, setShowProcessingModal] = useState(false);
	const [pollingEnabled, setPollingEnabled] = useState(false);
	const [currentTransactionId, setCurrentTransactionId] = useState<string | undefined>();

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
		setPollingEnabled(false);
		setShowProcessingModal(false);
		setCurrentTransactionId(undefined);
		actions.clearTransaction(vnpayGatewayId);
	}, [actions]);

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
	const makeTxOpts = (preOpenedWindow?: Window | null) => ({
		preOpenedWindow,
		onSetTransactionId: setCurrentTransactionId,
		onTrigger: ({ id, data }: { id: string; data?: unknown }) => void trigger({ id, data }),
		onActionRequired: (transactionId: string) => {
			setCurrentTransactionId(transactionId);
			setPollingEnabled(true);
			setShowProcessingModal(true);
			setLoadingCheckout(false);
		},
		onComplete: () => {
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
					setIsCreatingOrder(false);
					setLoadingCheckout(false);
				}
			});
		},
		onLoadingEnd: () => setLoadingCheckout(false),
		onResetRetryState: resetVNPayRetryState
	});

	const handleSubmit = useCallback(async () => {
		if (submitGuardRef.current) {
			return;
		}
		submitGuardRef.current = true;

		const isVNPay = paymentSectionSelectedId === vnpayGatewayId;

		try {
			if (isVNPay && !transaction?.[vnpayGatewayId]) {
				if (!checkout?.id) {
					setLoadingCheckout(false);
					return;
				}
				const preopenedPopup = preopenedPopupRef.current;
				preopenedPopupRef.current = null;
				if (!preopenedPopup || preopenedPopup.closed) {
					resetVNPayRetryState();
					void import("sonner").then(({ toast }) =>
						toast.error("Trình duyệt đang block popup. Vui lòng cho phép popup và thử lại.")
					);
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
						preopenedPopup.close();
						resetVNPayRetryState();
						void import("sonner").then(({ toast }) =>
							toast.error(`Lỗi khởi tạo VNPay: ${result.error instanceof Error ? result.error.message : "Không nhận được phản hồi"}`)
						);
						setLoadingCheckout(false);
						return;
					}
					if (txData.errors?.length) {
						preopenedPopup.close();
						resetVNPayRetryState();
						const msg = txData.errors.map((e) => e.message ?? e.code).join(", ");
						void import("sonner").then(({ toast }) => toast.error(`Lỗi VNPay: ${msg}`));
						setLoadingCheckout(false);
						return;
					}
					const eventType = txData.transactionEvent?.type;
					if (eventType === "AUTHORIZATION_FAILURE" || eventType === "CHARGE_FAILURE") {
						preopenedPopup.close();
						resetVNPayRetryState();
						void import("sonner").then(({ toast }) =>
							toast.error(`Lỗi VNPay: ${txData.transactionEvent?.message ?? "Lỗi không xác định"}`)
						);
						setLoadingCheckout(false);
						return;
					}
					actions.setUpdateState({ [vnpayGatewayId]: txData as TransactionInitialize });
					processTransactionData(txData as TransactionInitialize, makeTxOpts(preopenedPopup));
				} catch (err) {
					if (!preopenedPopup.closed) preopenedPopup.close();
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
				const preopenedPopup = preopenedPopupRef.current;
				preopenedPopupRef.current = null;
				if (!txData || !preopenedPopup || preopenedPopup.closed) {
					resetVNPayRetryState();
					void import("sonner").then(({ toast }) =>
						toast.error("Trình duyệt đang block popup. Vui lòng cho phép popup và thử lại.")
					);
					setLoadingCheckout(false);
					return;
				}
				processTransactionData(txData, makeTxOpts(preopenedPopup));
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
			processTransactionData(txData, makeTxOpts());
		} finally {
			submitGuardRef.current = false;
		}
	}, [
		actions,
		checkout?.id,
		paymentSectionSelectedId,
		preopenedPopupRef,
		resetVNPayRetryState,
		setLoadingCheckout,
		transaction,
		transactionInitialize,
		trigger
	]);

	usePayButtonValidation({
		preopenedPopupRef,
		paymentSectionSelectedId,
		onHandleSubmit: handleSubmit,
	});

	const handleCancelProcessing = useCallback(() => {
		resetVNPayRetryState();
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
		isCreatingOrder
	};
};
