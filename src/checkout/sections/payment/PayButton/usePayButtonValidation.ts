import { useCallback, useEffect, type MutableRefObject } from "react";
import { preOpenPaymentPopup } from "@/checkout/lib/paymentPopup";
import { vnpayGatewayId } from "@/checkout/sections/payment/PaymentSection/VNPay/types";
import {
	anyFormsValidating,
	areAllFormsValid,
	useCheckoutValidationState,
} from "@/checkout/state/checkoutValidationStateStore";
import { useCheckoutUpdateState, useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";
import { useCheckout } from "@hooks/checkout";

interface UsePayButtonValidationParams {
	preopenedPopupRef: MutableRefObject<Window | null>;
	paymentSectionSelectedId: string;
	onHandleSubmit: () => Promise<void>;
}

/** Watches validation state and triggers popup pre-open + payment submission once all forms are valid. */
export const usePayButtonValidation = ({
	preopenedPopupRef,
	paymentSectionSelectedId,
	onHandleSubmit,
}: UsePayButtonValidationParams) => {
	const checkoutUpdateState = useCheckoutUpdateState();
	const { validationState } = useCheckoutValidationState();
	const { setSubmitInProgress, setLoadingCheckout } = useCheckoutUpdateStateActions();
	const { checkout } = useCheckout();

	const handleValidate = useCallback(() => {
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
		void onHandleSubmit();
	}, [
		checkout?.deliveryMethod,
		checkout?.isShippingRequired,
		checkoutUpdateState.submitInProgress,
		onHandleSubmit,
		paymentSectionSelectedId,
		preopenedPopupRef,
		setLoadingCheckout,
		setSubmitInProgress,
		validationState,
	]);

	useEffect(() => {
		handleValidate();
	}, [handleValidate]);
};
