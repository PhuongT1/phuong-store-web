import { useMemo } from "react";
import { useCheckout } from "@hooks/checkout";
import { type CountryCode, ChannelDocument } from "@/checkout/graphql";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSWRGraphQl } from "@/hooks/swr/useSWR";
import { executeGraphQL } from "@/lib/api";

interface UseAvailableShippingCountries {
	availableShippingCountries: CountryCode[];
}

export const useAvailableShippingCountries = (): UseAvailableShippingCountries => {
	const { checkout } = useCheckout();

	const { data } = useSWRGraphQl(
		["channel_countries", checkout?.channel?.slug],
		([, slug]) =>
			executeGraphQL(ChannelDocument as any, {
				variables: { slug },
				withAuth: false
			}),
		{
			isPaused: () => !checkout?.channel?.slug
		}
	);

	const availableShippingCountries: CountryCode[] = useMemo(
		// @ts-ignore
		() => (data?.channel?.countries?.map(({ code }: any) => code) as CountryCode[]) || [],
		// @ts-ignore
		[data?.channel?.countries]
	);

	return { availableShippingCountries };
};
