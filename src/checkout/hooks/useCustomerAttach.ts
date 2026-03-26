import { useEffect, useMemo } from "react";
import { useCheckoutCustomerAttachMutation } from "@/checkout/graphql";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";
import { useUser } from "@/checkout/hooks/useUser";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";

export const useCustomerAttach = () => {
	const { checkout, isValidating: fetchingCheckout, mutate } = useCheckout();
	const { authenticated } = useUser();

	const [{ fetching: fetchingCustomerAttach }, customerAttach] = useCheckoutCustomerAttachMutation();

	const onSubmit = useSubmit<{}, typeof customerAttach>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "checkoutCustomerAttach",
				shouldAbort: () =>
					!!checkout?.user?.id || !authenticated || fetchingCustomerAttach || fetchingCheckout,
				onSubmit: customerAttach,
				parse: ({ languageCode, checkoutId }) => ({ languageCode, checkoutId }),
				onError: ({ errors }) => {
					if (
						errors.some((error) =>
							error?.message?.includes(
								"[GraphQL] You cannot reassign a checkout that is already attached to a user."
							)
						)
					) {
						void mutate();
					}
				}
			}),
			[authenticated, checkout?.user?.id, customerAttach, fetchingCheckout, fetchingCustomerAttach, mutate]
		)
	);

	useEffect(() => {
		void onSubmit();
	}, [onSubmit]);
};
