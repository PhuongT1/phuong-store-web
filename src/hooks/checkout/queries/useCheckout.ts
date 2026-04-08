"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { type Checkout, CheckoutFindDocument } from "@/gql/graphql";
import { CONFIG_SWR_KEYS } from "@config/keys";
import { executeGraphQL } from "@lib/api";
import { useSWRGraphQl } from "../../swr/useSWR";

type CheckoutLineProps = {
	id: string | null;
};

const useCheckoutId = () => {
	const searchParams = useSearchParams();
	return searchParams?.get(CONFIG_SWR_KEYS.CHECKOUT) ?? null;
};

/**
 * Fetches checkout by ID via SWR.
 *
 * Returns a stable `checkout` field that is protected against transient nulls:
 * when Saleor returns { checkout: null } due to an expiring auth token (owner-
 * protected checkouts are hidden from unauthenticated requests), the last
 * confirmed-live checkout is returned instead of null. This prevents flash-
 * of-empty-cart during token refresh cycles.
 *
 * `data.checkout` (raw SWR value) is still available for callers like
 * useCheckoutPolling that need to detect genuine order completion (null).
 */
const useCheckoutLine = ({ id }: CheckoutLineProps) => {
	const lastGoodCheckout = useRef<Checkout | null>(null);

	const swr = useSWRGraphQl(
		[CONFIG_SWR_KEYS.CHECKOUT, id],
		([, id]: [string, string | null]) =>
			executeGraphQL(CheckoutFindDocument, {
				variables: { id: id ?? "" },
				withAuth: true,
				cache: "no-store"
			}),
		{
			isPaused: () => !id,
			keepPreviousData: true
		}
	);

	if (swr.data?.checkout) {
		lastGoodCheckout.current = swr.data.checkout as Checkout;
	}

	// Stable checkout: use raw value if available, fall back to last known good.
	// Callers that need to detect genuine null (order complete detection in
	// useCheckoutPolling) should read swr.data?.checkout directly.
	const checkout = (swr.data?.checkout ?? lastGoodCheckout.current) as Checkout | null;

	return { ...swr, checkout };
};

const useCheckout = () => {
	const id = useCheckoutId();
	const { checkout, ...rest } = useCheckoutLine({ id });
	// checkout is Checkout | null; cast to Checkout — callers guard with checkout?.id
	return { checkout: checkout as Checkout, ...rest };
};

export { useCheckoutLine, useCheckout };
