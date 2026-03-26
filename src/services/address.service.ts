import { type District, type Province } from "@/types";

const ENDPOINT_API = "/api";

interface ResponseData<T = string[]> {
	results: T;
}

const getDistricts = async (countryArea: string) => {
	try {
		const response = await fetch(`${ENDPOINT_API}/province/district/${countryArea}`);
		const data = (await response.json()) as ResponseData<District[]>;
		return data.results;
	} catch (error) {
		console.error("Error fetching districts:", error);
		throw error;
	}
};

const getProvinces = async () => {
	try {
		const response = await fetch(`${ENDPOINT_API}/province`);
		const data = (await response.json()) as ResponseData<Province[]>;
		return data.results.map((item) => ({
			...item,
			province_name: item.province_name.replace("Tỉnh ", "").replace("Thành phố", "Tp.")
		}));
	} catch (error) {
		console.error("Error fetching province:", error);
		throw error;
	}
};

export { getDistricts, getProvinces, type ResponseData };
