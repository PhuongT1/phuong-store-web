"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/config";
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
	const redirectedRef = useRef(false);
	const router = useRouter();

	const swr = useSWRGraphQl(
		[CONFIG_SWR_KEYS.CHECKOUT, id],
		([, id]: [string, string | null]) =>
			executeGraphQL(CheckoutFindDocument, {
				variables: { id: id ?? "" },
				withAuth: false,
				cache: "no-store"
			}),
		{
			isPaused: () => !id,
			keepPreviousData: true,
			onSuccess(data) {
				if (data.checkout) {
					lastGoodCheckout.current = data.checkout as Checkout;
				} else if (lastGoodCheckout.current === null && !redirectedRef.current) {
					redirectedRef.current = true;
					toast.error("Giỏ hàng không tồn tại hoặc đã hết hạn", {
						description: "Vui lòng tiếp tục mua sắm."
					});
					router.replace(routes.home);
				}
			}
		}
	);

	// Stable checkout: fall back to last known good to prevent flash on token refresh.
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
