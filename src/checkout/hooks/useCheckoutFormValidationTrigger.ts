import { useCallback, useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type FormDataBase } from "@/checkout/hooks/useForm";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";
import {
	type CheckoutFormScope,
	useCheckoutValidationActions,
	useCheckoutValidationState
} from "@/checkout/state/checkoutValidationStateStore";
import { type FormikCompatForm } from "@checkout/hooks/useForm";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
	scope: CheckoutFormScope;
	form: FormikCompatForm<TData> | UseFormReturn<TData>;
	skip?: boolean;
}

// tells forms to validate once the pay button is clicked
export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
	scope,
	form,
	skip = false
}: UseCheckoutFormValidationTriggerProps<TData>) => {
	const { validationState } = useCheckoutValidationState();
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState(scope);
	const { setValidationState } = useCheckoutValidationActions();

	const validating = validationState[scope] === "validating";

	const handleGlobalValidationTrigger = useCallback(async () => {
		if (validating) {
			if (skip) {
				setValidationState(scope, "valid");
				return;
			}

			void setCheckoutFormValidationState(form);
		}
	}, [form, scope, setCheckoutFormValidationState, setValidationState, skip, validating]);

	useEffect(() => {
		void handleGlobalValidationTrigger();
	}, [handleGlobalValidationTrigger]);
};
