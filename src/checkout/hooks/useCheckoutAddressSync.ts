 
import { useEffect, useRef } from "react";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	isMatchingAddress
} from "@/checkout/components/AddressForm/utils";
import { type AddressInput, CheckoutBillingAddressUpdateDocument } from "@/gql/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

export const useCheckoutAddressSync = () => {
	const { checkout, mutate } = useCheckout();
	const { shippingAddress, billingAddress, id: checkoutId } = checkout;
	const isSyncing = useRef(false);

	useEffect(() => {
		const syncAddresses = async () => {
			if (!shippingAddress || isSyncing.current) {
				return;
			}

			// If billing is missing or different from shipping, sync it
			const needsSync = !billingAddress || !isMatchingAddress(shippingAddress, billingAddress);

			if (needsSync) {
				isSyncing.current = true;
				try {
					await executeGraphQL(CheckoutBillingAddressUpdateDocument, {
						variables: {
							checkoutId,
							validationRules: getAddressValidationRulesVariables(),
							billingAddress: getAddressInputDataFromAddress(shippingAddress)
						},
						withAuth: true
					});
					void mutate();
				} catch (error) {
					console.error("Failed to sync billing address:", error);
				} finally {
					isSyncing.current = false;
				}
			}
		};

		void syncAddresses();
	}, [shippingAddress, billingAddress, checkoutId, mutate]);
};
