import { getAPI, postAPI } from "@/lib/api/apiClient";
import { getQueryString } from "@/lib/utils";
import { type PaginatedRating, type Rating, type RatingFrom, type RatingVariables } from "@/types";

const ENDPOINT_API = "/product/reviews";
const REVIEW_PERSISTENCE_WINDOW_MS = 60_000;

const getRatingList = async (variables: RatingVariables) => {
	try {
		const queryString = getQueryString(variables);
		return await getAPI<PaginatedRating<Rating>>(`${ENDPOINT_API}${queryString}`);
	} catch (error) {
		throw error;
	}
};

const wasReviewPersisted = (review: Rating, payload: RatingFrom) => {
	const createdAt = Date.parse(review.createdAt);
	const isRecent = Number.isFinite(createdAt) && Date.now() - createdAt <= REVIEW_PERSISTENCE_WINDOW_MS;

	return (
		isRecent &&
		review.refProduct === payload.refProduct &&
		review.rating === payload.rating &&
		review.name === payload.name &&
		review.phoneNumber === payload.phoneNumber &&
		(review.shareFeelings ?? "") === (payload.shareFeelings ?? "")
	);
};

const recoverPersistedReviewAfterError = async (payload: RatingFrom) => {
	if (!payload.refProduct) return null;

	const queryString = getQueryString({ id: payload.refProduct, first: 10 });
	const response = await getAPI<PaginatedRating<Rating>>(`${ENDPOINT_API}${queryString}`);
	const matchedReview = response.data.find((review) => wasReviewPersisted(review, payload));

	return matchedReview ?? null;
};

const postData = async (_key: string, { arg }: { arg: RatingFrom }) => {
	const { refProduct, ...rest } = arg;
	try {
		return await postAPI(`${ENDPOINT_API}?id=${refProduct}`, rest);
	} catch (error) {
		const persistedReview = await recoverPersistedReviewAfterError(arg);
		if (persistedReview) {
			return { ok: true, recovered: true, review: persistedReview };
		}
		throw error;
	}
};

export { getRatingList, postData };
