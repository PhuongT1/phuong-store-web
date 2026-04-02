import { useCallback } from "react";
import { type FieldPath, type UseFormReturn } from "react-hook-form";
import { type FormDataBase, hasErrors } from "@/checkout/hooks/useForm";
import {
	type CheckoutFormScope,
	useCheckoutValidationActions
} from "@/checkout/state/checkoutValidationStateStore";
import { type FormikCompatForm } from "@checkout/hooks/useForm";

export const useSetCheckoutFormValidationState = (scope: CheckoutFormScope) => {
	const { setValidationState } = useCheckoutValidationActions();

	const setCheckoutFormValidationState = useCallback(
		async <TData extends FormDataBase>(
			form:
				| Pick<FormikCompatForm<TData>, "validateForm" | "setTouched" | "values">
				| Pick<UseFormReturn<TData>, "trigger" | "formState" | "setFocus">
		) => {
			if ("validateForm" in form && "setTouched" in form && "values" in form) {
				const { validateForm, setTouched, values } = form as FormikCompatForm<TData>;
				if (!validateForm) return;

				const formErrors = await validateForm(values);

				if (!hasErrors(formErrors)) {
					setValidationState(scope, "valid");
					return;
				}

				await setTouched(Object.keys(formErrors).reduce((result, key) => ({ ...result, [key]: true }), {}));
				setValidationState(scope, "invalid");
				return;
			}

			if ("trigger" in form) {
				const isValid = await form.trigger();
				if (isValid) {
					setValidationState(scope, "valid");
					return;
				}

				setValidationState(scope, "invalid");
				const errors = form.formState.errors as Record<string, unknown> | undefined;
				const firstErrorKey = errors ? Object.keys(errors)[0] : undefined;
				if (firstErrorKey && form.setFocus) {
					form.setFocus(firstErrorKey as FieldPath<TData>);
				}
			}
		},
		[scope, setValidationState]
	);

	return {
		setCheckoutFormValidationState
	};
};
