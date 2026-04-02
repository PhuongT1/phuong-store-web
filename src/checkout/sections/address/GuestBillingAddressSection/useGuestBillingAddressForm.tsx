 
import { useMemo } from "react";
import { omit } from "lodash-es";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import {
	getAddressFormDataFromAddress,
	getAddressInputData,
	getAddressValidationRulesVariables
} from "@/checkout/components/AddressForm/utils";
import {
	type AutoSaveAddressFormData,
	useAutoSaveAddressForm
} from "@/checkout/hooks/useAutoSaveAddressForm";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";
import { useMutation } from "@/checkout/lib/useMutation";
import { type CheckoutBillingAddressUpdateMutation, type CheckoutBillingAddressUpdateMutationVariables, CheckoutBillingAddressUpdateDocument } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";

interface GuestBillingAddressFormProps {
	skipValidation: boolean;
}

export const useGuestBillingAddressForm = ({ skipValidation = true }: GuestBillingAddressFormProps) => {
	const {
		checkout: { billingAddress }
	} = useCheckout();
	const validationSchema = useAddressFormSchema();
	const [, checkoutBillingAddressUpdate] = useMutation<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>(CheckoutBillingAddressUpdateDocument);
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("billingAddress");

	const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutBillingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutBillingUpdate",
				onSubmit: checkoutBillingAddressUpdate,
				parse: ({ languageCode, checkoutId, ...rest }) => {
					return {
						languageCode,
						checkoutId,
						billingAddress: getAddressInputData(omit(rest, ["channel"])),
						validationRules: getAddressValidationRulesVariables({ autoSave: true })
					};
				},
				onSuccess: ({ data, formHelpers }) => {
					void setCheckoutFormValidationState({
						...formHelpers,
						values: getAddressFormDataFromAddress(data.checkout?.billingAddress)
					});
				}
			}),
			[
				billingAddress?.country.code,
				checkoutBillingAddressUpdate,
				setCheckoutFormValidationState
			]
		)
	);

	const form = useAutoSaveAddressForm({
		onSubmit,
		initialValues: getAddressFormDataFromAddress(billingAddress),
		validationSchema,
		scope: "checkoutBillingUpdate"
	});

	useCheckoutFormValidationTrigger({
		form,
		scope: "billingAddress",
		skip: skipValidation
	});

	return form;
};
