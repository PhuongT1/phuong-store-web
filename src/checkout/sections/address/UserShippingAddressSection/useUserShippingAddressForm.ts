import { useCallback } from "react";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getByMatchingAddress,
	isMatchingAddress
} from "@/checkout/components/AddressForm/utils";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import {
	type AddressListFormData,
	useAddressListForm
} from "@/checkout/sections/address/AddressList/useAddressListForm";
import {
	type AddressFragment,
	type AddressInput,
	CheckoutBillingAddressUpdateDocument,
	CheckoutShippingAddressUpdateDocument
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { useCheckout } from "@hooks/checkout";
export const useUserShippingAddressForm = () => {
	const { checkout, mutate } = useCheckout();
	const { shippingAddress } = checkout;
	const { user } = useUser();

	const onSubmit = useCallback(
		async (formData: AddressListFormData) => {
			const selectedAddress = formData.addressList.find(getById(formData.selectedAddressId));

			const isSameAddress = isMatchingAddress(shippingAddress, selectedAddress);
			const hasCity = !!shippingAddress?.city;

			// Return early when:
			// - No address selected yet (user hasn't picked one), OR
			// - Same address already set AND has a city (Saleor will keep existing
			//   shippingMethods — no need to re-send; avoids redundant API call
			//   on every checkout page visit when useUser resolves after useCheckout).
			// NOTE: do NOT include hasShippingMethods in guard — shippingMethods may be
			// momentarily empty on first render even though the address is correct.
			if (!formData.selectedAddressId || (isSameAddress && hasCity)) {
				return;
			}

			const addressFragment = selectedAddress as AddressFragment;

			try {
				const [shippingResponse] = await Promise.all([
					executeGraphQL(CheckoutShippingAddressUpdateDocument, {
						variables: {
							checkoutId: checkout.id,
							validationRules: getAddressValidationRulesVariables(),
							shippingAddress: getAddressInputDataFromAddress(addressFragment)
						},
						withAuth: true
					}),
					// Billing mirrors shipping — send both in parallel.
					// Input data is identical regardless of Saleor's shipping response.
					executeGraphQL(CheckoutBillingAddressUpdateDocument, {
						variables: {
							checkoutId: checkout.id,
							validationRules: getAddressValidationRulesVariables(),
							billingAddress: getAddressInputDataFromAddress(addressFragment)
						},
						withAuth: true
					})
				]);

				const errors = shippingResponse?.checkoutShippingAddressUpdate?.errors || [];
				if (!errors.length) {
					void mutate();
				}
			} catch (err) {
				console.error(err);
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
