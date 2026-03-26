 
import { pick } from "lodash-es";
import { useCallback } from "react";
import { type FormikProps } from "formik";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { type CountryCode } from "@/checkout/graphql";
import { useDebouncedSubmit } from "@/checkout/hooks/useDebouncedSubmit";
import { type FormHelpers, type FormProps, hasErrors, useForm } from "@/checkout/hooks/useForm";
import {
	type CheckoutUpdateStateScope,
	useCheckoutUpdateStateChange
} from "@/checkout/state/updateStateStore";

export type AutoSaveAddressFormData = Partial<AddressFormData>;
export type ShouldValidate = { noValidate?: boolean };

export type EventAddressForm<T = void> = T extends void ? ShouldValidate : ShouldValidate & T;

export const useAutoSaveAddressForm = ({
	scope,
	...formProps
}: FormProps<AutoSaveAddressFormData> & {
	scope: CheckoutUpdateStateScope;
}): FormikProps<AutoSaveAddressFormData> & {
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

	const formHelperCountryCode = pick(form, [
		// "setFieldTouched"
	]) as FormHelpers<AutoSaveAddressFormData>;

	// it'd make sense for onSubmit prop to be optional but formik has ignored this
	// request for forever now https://github.com/jaredpalmer/formik/issues/2675
	// so we're just gonna add a partial submit for guest address form to work

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
		// void partialSubmit();
	};

	return { ...form, handleChange: onChange, handleBlur: onBlur, handleSubmit: partialSubmit };
};
