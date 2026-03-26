import { getAPI, postAPI } from "@/lib/api/apiClient";
import { getQueryString } from "@/lib/utils";
import { type PaginatedRating, type Rating, type RatingFrom, type RatingVariables } from "@/types";

const ENDPOINT_API = "/product/reviews";

const getRatingList = async (variables: RatingVariables) => {
	try {
		const queryString = getQueryString(variables);
		return await getAPI<PaginatedRating<Rating>>(`${ENDPOINT_API}${queryString}`);
	} catch (error) {
		throw error;
	}
};

const postData = async (_key: string, { arg }: { arg: RatingFrom }) => {
	try {
		const { refProduct, ...rest } = arg;
		return await postAPI(`${ENDPOINT_API}?id=${refProduct}`, rest);
	} catch (error) {
		throw error;
	}
};

export { getRatingList, postData };
