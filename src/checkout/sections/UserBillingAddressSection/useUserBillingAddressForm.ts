 

import { useCallback, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import { useCheckout } from "@hooks/checkout";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	isMatchingAddress
} from "@/checkout/components/AddressForm/utils";
import { type AddressFragment } from "@/checkout/graphql";
import { CheckoutBillingAddressUpdateDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import {
	type AddressListFormData,
	useAddressListForm
} from "@/checkout/sections/AddressList/useAddressListForm";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

export const useUserBillingAddressForm = () => {
	const { checkout, mutate } = useCheckout();
	const { billingAddress } = checkout;
	const { setChangingBillingCountry } = useCheckoutUpdateStateActions();

	const { user } = useUser();

	const onSubmit = useCallback(
		async (formData: AddressListFormData) => {
			if (
				!formData.selectedAddressId ||
				(isMatchingAddress(billingAddress, formData.addressList.find(getById(formData.selectedAddressId))) &&
					billingAddress?.city)
			) {
				return {
					hasErrors: false,
					apiErrors: [],
					graphqlErrors: [],
					customErrors: []
				} as any;
			}

			const addressFragment = formData.addressList.find(
				getById(formData.selectedAddressId)
			) as AddressFragment;

			try {
				const response = await executeGraphQL(CheckoutBillingAddressUpdateDocument, {
					variables: {
						checkoutId: checkout.id,
						validationRules: getAddressValidationRulesVariables(),
						 
						billingAddress: getAddressInputDataFromAddress(addressFragment) as any
					},
					withAuth: true
				});

				const errors = response?.checkoutBillingAddressUpdate?.errors || [];

				if (!errors.length) {
					void mutate();
				}

				return {
					hasErrors: errors.length > 0,
					apiErrors: errors,
					graphqlErrors: [],
					customErrors: []
					 
				};
			} catch (err) {
				console.error(err);
				return {
					hasErrors: true,
					apiErrors: [],
					graphqlErrors: [],
					customErrors: [{ message: "Network Error" }]
					 
				};
			} finally {
				setChangingBillingCountry(false);
			}
		},
		[billingAddress, checkout.id, mutate, setChangingBillingCountry]
	);

	const { form, userAddressActions } = useAddressListForm({
		onSubmit,
		defaultAddress: user?.defaultBillingAddress,
		checkoutAddress: checkout.billingAddress
	});

	const selectedAddressId = useWatch({ control: form.control, name: "selectedAddressId" });
	const isFirstRun = useRef(true);

	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
		setChangingBillingCountry(true);
	}, [selectedAddressId, setChangingBillingCountry]);

	return { form, userAddressActions };
};
