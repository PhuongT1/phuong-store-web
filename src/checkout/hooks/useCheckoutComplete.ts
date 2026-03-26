import { useMemo } from "react";
import { useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";
// import { removeIdFromCookie } from "@/lib/actions/checkout";

export const useCheckoutComplete = () => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();
	const [{ fetching }, checkoutComplete] = useCheckoutCompleteMutation();

	const onCheckoutComplete = useSubmit<{}, typeof checkoutComplete>(
		useMemo(
			() => ({
				parse: () => ({
					checkoutId
				}),
				onSubmit: checkoutComplete,
				onSuccess: ({ data }) => {
					// void removeIdFromCookie("hcm");
					// const order = data.order;
					// if (order) {
					// 	const newUrl = replaceUrl({
					// 		query: {
					// 			order: order.id
					// 		},
					// 		replaceWholeQuery: true
					// 	});
					// 	window.location.href = newUrl;
					// }
				}
			}),
			[checkoutComplete, checkoutId]
		)
	);
	return { completingCheckout: fetching, onCheckoutComplete };
};
