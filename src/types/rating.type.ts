import { type PaginatedData, type PageInfo } from "./common.type";

type Rating = {
	id: number;
	name: string;
	shareFeelings: string;
	rating: number;
	email: string;
	createdAt: string;
	phoneNumber: string;
	image_url: string;
	refProduct: string;
	isRecomment?: boolean;
};
type RatingFrom = Omit<Rating, "createdAt" | "image_url" | "id">;
type RatingList = {
	reviews: Rating[];
} & PageInfo;
type IdRating = {
	id?: string;
};
type RatingVariables = {
	first: number;
	after?: number;
} & IdRating;
interface RatingDistribution {
	rating: number;
	count: string;
	percentage: string;
}

type TotalRating = {
	totalCount: number;
	averageRating: number;
};
type SummaryRating = {
	summary: {
		ratingDistribution: RatingDistribution[];
	} & TotalRating;
};
type PaginatedRating<T = unknown> = PaginatedData<T> & SummaryRating;
export {
	type RatingList,
	type RatingVariables,
	type Rating,
	type PaginatedRating,
	type SummaryRating,
	type RatingFrom,
	type RatingDistribution,
	type IdRating,
	type TotalRating
};
