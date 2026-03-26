"use client";

import useSWRMutation from "swr/mutation";
import { useFetcher } from "../../useFetcher";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { replaceUrl } from "@/checkout/lib/utils/url";
import { CheckoutCompleteDocument, type CheckoutCompleteMutationVariables } from "@/gql/graphql";
import { removeCheckoutIdCookie } from "@/action";
import { CONFIG } from "@/constants";

const useCheckoutComplete = () => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();
	const { fetcherGraphQL } = useFetcher();

	const fetchData = async (_key: string, { arg }: { arg: CheckoutCompleteMutationVariables }) =>
		fetcherGraphQL([CheckoutCompleteDocument, arg]);

	const { isMutating: fetching, trigger: checkoutComplete } = useSWRMutation(
		CONFIG.CHECKOUT_KEY.completionKey,
		fetchData
	);

	const onCheckoutComplete = async ({
		checkoutId,
		onError
	}: {
		checkoutId: string;
		onError?: () => void;
	}) => {
		try {
			const data = await checkoutComplete({ checkoutId });

			if (data?.checkoutComplete?.errors?.length) {
				const errors = data.checkoutComplete.errors;
				void import("sonner").then(({ toast }) => {
					toast.error("Lỗi hoàn tất đơn hàng: " + (errors?.[0]?.message || "Vui lòng thử lại."));
				});
				onError?.();
				return;
			}

			void removeCheckoutIdCookie();
			const order = data?.checkoutComplete?.order;
			if (order) {
				const newUrl = replaceUrl({
					query: {
						order: order.id
					},
					replaceWholeQuery: true
				});
				window.location.href = newUrl;
			} else {
				onError?.();
			}
		} catch (_error) {
			void import("sonner").then(({ toast }) => {
				toast.error("Lỗi hệ thống khi hoàn tất đơn hàng. Vui lòng thử lại.");
			});
			onError?.();
		}
	};

	return { completingCheckout: fetching, onCheckoutComplete, checkoutId };
};

export { useCheckoutComplete };
