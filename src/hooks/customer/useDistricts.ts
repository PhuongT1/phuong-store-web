import useSWR from "swr";
import { getDistricts } from "@/services";

type Districts = {
	countryArea?: string;
} & Parameters<typeof useSWR>[2];

const useDistricts = ({ countryArea }: Districts) => {
	return useSWR(countryArea ? ["districts", countryArea] : null, (key: readonly [string, string]) => {
		const [, country] = key;
		return getDistricts(country);
	});
};

export { useDistricts };
