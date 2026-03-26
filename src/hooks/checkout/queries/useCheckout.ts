"use client";

import { useSearchParams } from "next/navigation";
import { executeGraphQL } from "@lib/api";
import { CONFIG_SWR_KEYS } from "@config/keys";
import { useSWRGraphQl } from "../../swr/useSWR";
import { type Checkout, CheckoutFindDocument } from "@/gql/graphql";

type CheckoutLineProps = {
	id: string | null;
};

const useCheckoutId = () => {
	const searchParams = useSearchParams();
	return searchParams?.get(CONFIG_SWR_KEYS.CHECKOUT) ?? null;
};

const useCheckoutLine = ({ id }: CheckoutLineProps) => {
	return useSWRGraphQl(
		[CONFIG_SWR_KEYS.CHECKOUT, id],
		([, id]: [string, string | null]) =>
			executeGraphQL(CheckoutFindDocument, {
				variables: { id: id ?? "" },
				withAuth: false,
				cache: "no-store"
			}),
		{
			isPaused: () => !id,
			keepPreviousData: true
		}
	);
};

const useCheckout = () => {
	const id = useCheckoutId();
	const { data, ...rest } = useCheckoutLine({ id });
	return { checkout: { ...(data?.checkout || ({} as Partial<Checkout>)) } as Checkout, ...rest };
};

export { useCheckoutLine, useCheckout };
