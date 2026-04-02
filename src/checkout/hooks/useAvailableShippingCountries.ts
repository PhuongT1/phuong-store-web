import { useMemo } from "react";
import { type CountryCode, type ChannelQuery, ChannelDocument } from "@/gql/graphql";
import { useSWRGraphQl } from "@/hooks/swr/useSWR";
import { executeGraphQL } from "@/lib/api";
import { useCheckout } from "@hooks/checkout";

interface UseAvailableShippingCountries {
	availableShippingCountries: CountryCode[];
}

export const useAvailableShippingCountries = (): UseAvailableShippingCountries => {
	const { checkout } = useCheckout();

	const { data } = useSWRGraphQl<ChannelQuery>(
		["channel_countries", checkout?.channel?.slug],
		([, slug]) =>
			executeGraphQL(ChannelDocument as unknown as Parameters<typeof executeGraphQL>[0], {
				variables: { slug },
				withAuth: false
			}),
		{
			isPaused: () => !checkout?.channel?.slug
		}
	);

	const availableShippingCountries: CountryCode[] = useMemo(
		() =>
			(data?.channel?.countries?.map(({ code }) => code as CountryCode)) || [],
		[data?.channel?.countries]
	);

	return { availableShippingCountries };
};
