 

import { useCallback } from "react";
import { useCheckout } from "@hooks/checkout";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getByMatchingAddress,
	isMatchingAddress
} from "@/checkout/components/AddressForm/utils";
import { type AddressFragment } from "@/checkout/graphql";
import { CheckoutBillingAddressUpdateDocument, CheckoutShippingAddressUpdateDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import {
	type AddressListFormData,
	useAddressListForm
} from "@/checkout/sections/AddressList/useAddressListForm";
export const useUserShippingAddressForm = () => {
	const { checkout, mutate } = useCheckout();
	const { shippingAddress } = checkout;
	const { user } = useUser();

	const onSubmit = useCallback(
		async (formData: AddressListFormData) => {
			const selectedAddress = formData.addressList.find(getById(formData.selectedAddressId));

			const isSameAddress = isMatchingAddress(shippingAddress, selectedAddress);
			const hasCity = !!shippingAddress?.city;
			const hasShippingMethods = (checkout?.shippingMethods?.length || 0) > 0;

			if (!formData.selectedAddressId || (isSameAddress && hasCity && hasShippingMethods)) {
				return {
					hasErrors: false,
					apiErrors: [],
					graphqlErrors: [],
					customErrors: []
				} as any;
			}

			const addressFragment = selectedAddress as AddressFragment;

			try {
				const response = await executeGraphQL(CheckoutShippingAddressUpdateDocument, {
					variables: {
						checkoutId: checkout.id,
						validationRules: getAddressValidationRulesVariables(),
						shippingAddress: getAddressInputDataFromAddress(addressFragment) as any
					},
					withAuth: true
				});

				const errors = response?.checkoutShippingAddressUpdate?.errors || [];

				if (!errors.length) {
					// Always sync billing with shipping as requested by user
					await executeGraphQL(CheckoutBillingAddressUpdateDocument, {
						variables: {
							checkoutId: checkout.id,
							validationRules: getAddressValidationRulesVariables(),
							billingAddress: getAddressInputDataFromAddress(addressFragment) as any
						},
						withAuth: true
					});
					void mutate();
				}

				return {
					hasErrors: errors.length > 0,
					apiErrors: errors,
					graphqlErrors: [],
					customErrors: []
				} as any;
			} catch (err) {
				console.error(err);
				return {
					hasErrors: true,
					apiErrors: [],
					graphqlErrors: [],
					customErrors: [{ message: "Network Error" }]
				} as any;
			}
		},
		[checkout.id, mutate, shippingAddress]
	);

	const { form, userAddressActions } = useAddressListForm({
		onSubmit,
		defaultAddress: user?.defaultShippingAddress,
		checkoutAddress: shippingAddress
	});

	return { form, userAddressActions };
};
