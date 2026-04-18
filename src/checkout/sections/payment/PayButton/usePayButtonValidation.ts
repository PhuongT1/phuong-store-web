import { useCallback, useEffect } from "react";
import {
	anyFormsValidating,
	areAllFormsValid,
	useCheckoutValidationState,
} from "@/checkout/state/checkoutValidationStateStore";
import { useCheckoutUpdateState, useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";
import { useCheckout } from "@hooks/checkout";

interface UsePayButtonValidationParams {
	onHandleSubmit: () => Promise<void>;
}

/** Watches validation state and triggers payment submission once all forms are valid. */
export const usePayButtonValidation = ({
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
			setSubmitInProgress(false);
			return;
		}

		if (checkout?.isShippingRequired && !checkout.deliveryMethod) {
			setSubmitInProgress(false);
			void import("sonner").then(({ toast }) => toast.error("Vui lòng chọn phương thức vận chuyển."));
			return;
		}

		setLoadingCheckout(true);
		setSubmitInProgress(false);
		void onHandleSubmit();
	}, [
		checkout?.deliveryMethod,
		checkout?.isShippingRequired,
		checkoutUpdateState.submitInProgress,
		onHandleSubmit,
		setLoadingCheckout,
		setSubmitInProgress,
		validationState,
	]);

	useEffect(() => {
		handleValidate();
	}, [handleValidate]);
};
