import { useEffect, useRef, useState } from "react";
import { useCheckout } from "@hooks/checkout";
import { processTransactionData } from "./processTransactionData";
import { useTransactionInitializeMutation } from "@/checkout/graphql";
import {
	useTransactionInitializeState,
	useCheckoutTransactionStateStore
} from "@/checkout/state/checkoutTransactionStateStore";
import {
	anyFormsValidating,
	areAllFormsValid,
	useCheckoutValidationActions,
	useCheckoutValidationState
} from "@/checkout/state/checkoutValidationStateStore";
import { useUser } from "@/checkout/hooks/useUser";
import { useCheckoutUpdateState, useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";
import { useTransactionProcess } from "@/hooks/checkout/mutations/useTransaction";
import { preOpenPaymentPopup } from "@/checkout/lib/paymentPopup";
import { useCheckoutPolling } from "@/checkout/hooks/useCheckoutPolling";
import { vnpayGatewayId } from "@/checkout/sections/PaymentSection/VNPay/types";

export const usePayButton = () => {
	const { transaction, paymentSectionSelectedId } = useTransactionInitializeState();
	const { actions } = useCheckoutTransactionStateStore();
	const { authenticated } = useUser();
	const { checkout } = useCheckout();
	const [, transactionInitialize] = useTransactionInitializeMutation();

	const checkoutUpdateState = useCheckoutUpdateState();
	const { validationState } = useCheckoutValidationState();
	const { setSubmitInProgress, setShouldRegisterUser, setLoadingCheckout } = useCheckoutUpdateStateActions();
	const { validateAllForms } = useCheckoutValidationActions();

	const preopenedPopupRef = useRef<Window | null>(null);
	const [showProcessingModal, setShowProcessingModal] = useState(false);
	const [pollingEnabled, setPollingEnabled] = useState(false);
	const [currentTransactionId, setCurrentTransactionId] = useState<string | undefined>();

	const { trigger } = useTransactionProcess({
		onSuccess: () => setLoadingCheckout(false),
		onError: () => setLoadingCheckout(false)
	});

	const { isPolling, timeElapsed } = useCheckoutPolling({
		enabled: pollingEnabled,
		checkoutId: checkout?.id ?? "",
		transactionId: currentTransactionId,
		interval: 2000,
		timeout: 60000,
		onOrderCreated: (orderId) => {
			setPollingEnabled(false);
			setShowProcessingModal(false);
			setLoadingCheckout(false);
			void import("sonner").then(({ toast }) => toast.success("Thanh toán thành công!"));
			window.location.href =
				orderId !== "unknown" ? `/order-confirmation?order=${orderId}` : "/account/orders";
		},
		onTimeout: () => {
			setShowProcessingModal(false);
			setLoadingCheckout(false);
			void import("sonner").then(({ toast }) =>
				toast.error("Không thể xác nhận thanh toán. Vui lòng kiểm tra đơn hàng hoặc liên hệ hỗ trợ.")
			);
		},
		onError: () => undefined
	});

	// Build options object for processTransactionData util
	const makeTxOpts = (preOpenedWindow?: Window | null) => ({
		preOpenedWindow,
		onSetTransactionId: setCurrentTransactionId,
		onTrigger: ({ id, data }: { id: string; data?: unknown }) => void trigger({ id, data }),
		onLoadingEnd: () => setLoadingCheckout(false)
	});

	const handleSubmit = async () => {
		const isVNPay = paymentSectionSelectedId === vnpayGatewayId;

		if (isVNPay && !transaction?.[vnpayGatewayId]) {
			if (!checkout?.id) {
				setLoadingCheckout(false);
				return;
			}
			const preopenedPopup = preopenedPopupRef.current;
			preopenedPopupRef.current = null;
			if (!preopenedPopup || preopenedPopup.closed) {
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
					void import("sonner").then(({ toast }) =>
						toast.error(`Lỗi khởi tạo VNPay: ${result.error?.message ?? "Không nhận được phản hồi"}`)
					);
					setLoadingCheckout(false);
					return;
				}
				if (txData.errors?.length) {
					preopenedPopup.close();
					const msg = txData.errors.map((e) => e.message ?? e.code).join(", ");
					void import("sonner").then(({ toast }) => toast.error(`Lỗi VNPay: ${msg}`));
					setLoadingCheckout(false);
					return;
				}
				const eventType = txData.transactionEvent?.type;
				if (eventType === "AUTHORIZATION_FAILURE" || eventType === "CHARGE_FAILURE") {
					preopenedPopup.close();
					void import("sonner").then(({ toast }) =>
						toast.error(`Lỗi VNPay: ${txData.transactionEvent?.message ?? "Lỗi không xác định"}`)
					);
					setLoadingCheckout(false);
					return;
				}
				actions.setUpdateState({ [vnpayGatewayId]: txData });
				processTransactionData(txData, makeTxOpts(preopenedPopup));
			} catch (err) {
				if (!preopenedPopup.closed) preopenedPopup.close();
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
			setLoadingCheckout(false);
			return;
		}
		processTransactionData(txData, makeTxOpts());
	};

	const handleValidate = () => {
		if (!checkoutUpdateState.submitInProgress) return;

		const validating = anyFormsValidating(validationState);
		if (validating) return;

		const allFormsValid = areAllFormsValid(validationState);
		if (!allFormsValid) {
			// Close popup only if it was accidentally opened before this point
			if (preopenedPopupRef.current && !preopenedPopupRef.current.closed) {
				preopenedPopupRef.current.close();
			}
			preopenedPopupRef.current = null;
			return;
		}

		if (checkout?.isShippingRequired && !checkout.deliveryMethod) {
			preopenedPopupRef.current?.close();
			preopenedPopupRef.current = null;
			setSubmitInProgress(false);
			void import("sonner").then(({ toast }) => toast.error("Vui lòng chọn phương thức vận chuyển."));
			return;
		}

		// All forms valid — open VNPay popup here (still within Chrome's ~5 s
		// transient-activation window from the button click that started this flow)
		if (paymentSectionSelectedId === vnpayGatewayId && !preopenedPopupRef.current) {
			const popup = preOpenPaymentPopup(800, 700);
			if (!popup) {
				setSubmitInProgress(false);
				void import("sonner").then(({ toast }) =>
					toast.error("Trình duyệt đang block popup. Vui lòng cho phép popup và thử lại.")
				);
				return;
			}
			preopenedPopupRef.current = popup;
		}

		setLoadingCheckout(true);
		setSubmitInProgress(false);
		void handleSubmit();
	};

	useEffect(() => {
		handleValidate();
	}, [validationState, checkoutUpdateState.submitInProgress, transaction]); // eslint-disable-line react-hooks/exhaustive-deps

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
		handleClickOrder
	};
};
