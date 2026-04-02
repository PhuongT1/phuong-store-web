import { useCallback } from "react";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";
import { type CountryCode } from "@/gql/graphql";

export const useAddressAvailability = (skipCheck = false) => {
	const { availableShippingCountries } = useAvailableShippingCountries();

	const isAvailable = useCallback(
		({ country }: { country: { code: string } }) => {
			if (skipCheck) {
				return true;
			}

			return availableShippingCountries.includes(country?.code as CountryCode);
		},
		[skipCheck, availableShippingCountries],
	);

	return { isAvailable, availableShippingCountries };
};
