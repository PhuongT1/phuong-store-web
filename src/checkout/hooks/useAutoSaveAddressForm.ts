 
import { useCallback } from "react";
import { pick } from "lodash-es";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { useDebouncedSubmit } from "@/checkout/hooks/useDebouncedSubmit";
import { type FormHelpers, type FormProps, hasErrors, useForm } from "@/checkout/hooks/useForm";
import {
	type CheckoutUpdateStateScope,
	useCheckoutUpdateStateChange
} from "@/checkout/state/updateStateStore";
import { type CountryCode } from "@/gql/graphql";
import { type FormikCompatForm } from "@checkout/hooks/useForm";

export type AutoSaveAddressFormData = Partial<AddressFormData>;
export type ShouldValidate = { noValidate?: boolean };

export type EventAddressForm<T = void> = T extends void ? ShouldValidate : ShouldValidate & T;

export const useAutoSaveAddressForm = ({
	scope,
	...formProps
}: FormProps<AutoSaveAddressFormData> & {
	scope: CheckoutUpdateStateScope;
}): FormikCompatForm<AutoSaveAddressFormData> & {
	handleSubmit: <T>(event: EventAddressForm<T>) => Promise<void>;
} => {
	const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
	const { initialValues, onSubmit } = formProps;
	const { setCountryCode, validationSchema } = useAddressFormSchema(initialValues.countryCode);

	const form = useForm<AutoSaveAddressFormData>({ ...formProps, validationSchema });
	const { values, validateForm, dirty, handleBlur, handleChange } = form;

	const debouncedSubmit = useDebouncedSubmit(onSubmit);

	const formHelpers = pick(form, [
		"setErrors",
		"setStatus",
		"setTouched",
		"setValues",
		"setSubmitting",
		"setFormikState",
		"setFieldValue",
		"setFieldTouched",
		"setFieldError",
		"validateForm",
		"validateField",
		"resetForm",
		"submitForm"
	]) as FormHelpers<AutoSaveAddressFormData>;

	const formHelperCountryCode = pick(form, []) as FormHelpers<AutoSaveAddressFormData>;

	const partialSubmit = useCallback(
		async (event?: EventAddressForm) => {
			const formData = { ...initialValues, countryCode: values.countryCode, ...values };

			if (event?.noValidate) {
				setCheckoutUpdateState("loading");

				return void debouncedSubmit?.(formData);
			}
			const formErrors = await validateForm(values);
			if (!hasErrors(formErrors) && dirty) {
				setCheckoutUpdateState("loading");
				void debouncedSubmit?.(formData, formHelpers);
			}
		},
		[validateForm, values, dirty, setCheckoutUpdateState, debouncedSubmit, initialValues, formHelpers]
	);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (name === "countryCode") {
			setCountryCode(value as CountryCode);
			void debouncedSubmit?.(
				{ ...initialValues, countryCode: values.countryCode, ...values },
				formHelperCountryCode
			);
		}

		handleChange(event);
		void partialSubmit();
	};

	const onBlur = (event: React.FocusEvent) => {
		handleBlur(event);
	};

	return { ...form, handleChange: onChange, handleBlur: onBlur, handleSubmit: partialSubmit };
};
