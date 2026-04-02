import { useMemo } from "react";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { useMutation } from "@/checkout/lib/useMutation";
import { type CheckoutCompleteMutation, type CheckoutCompleteMutationVariables, CheckoutCompleteDocument } from "@/gql/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";

export const useCheckoutComplete = () => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();
	const [{ fetching }, checkoutComplete] = useMutation<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>(CheckoutCompleteDocument);

	const onCheckoutComplete = useSubmit<{}, typeof checkoutComplete>(
		useMemo(
			() => ({
				parse: () => ({
					checkoutId
				}),
				onSubmit: checkoutComplete,
				onSuccess: () => {}
			}),
			[checkoutComplete, checkoutId]
		)
	);
	return { completingCheckout: fetching, onCheckoutComplete };
};
