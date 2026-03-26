// "use client";

// import useSWR from "swr";
// import { useEffect, useMemo } from "react";
// import { extractCheckoutIdFromUrl } from "@checkout/lib/utils/url";
// import { useCheckoutUpdateStateActions } from "@checkout/state/updateStateStore";
// import { LANGUAGE_CODE_DEFAULT } from "@/constants";
// import { type Checkout, CheckoutFindDocument, type CheckoutFindQuery } from "@/gql/graphql";
// import { executeGraphQL } from "@lib/api";

// type CheckoutLineProps = {
// 	id: string;
// 	pause?: boolean;
// };

// const useCheckoutLine = ({ id, pause }: CheckoutLineProps) => {
// 	return useSWR<CheckoutFindQuery>(!pause && [CheckoutFindDocument.toString(), id], {
// 		fetcher: ([document, id]) =>
// 			executeGraphQL(String(document), {
// 				variables: {
// 					id,
// 					languageCode: LANGUAGE_CODE_DEFAULT
// 				}
// 			})
// 	});
// };

// const useCheckout = ({ pause = false } = {}) => {
// 	const id = useMemo(() => extractCheckoutIdFromUrl(), []);
// 	const { setLoadingCheckout } = useCheckoutUpdateStateActions();
// 	const { data, isLoading: stale, isValidating: fetching, mutate: refetch } = useCheckoutLine({ id, pause });

// 	useEffect(() => setLoadingCheckout(fetching || stale), [fetching, setLoadingCheckout, stale]);

// 	return useMemo(
// 		() => ({ checkout: data?.checkout || ({} as Checkout), fetching: fetching || stale, refetch }),
// 		[data?.checkout, fetching, refetch, stale]
// 	);
// };

// export { useCheckoutLine, useCheckout };
