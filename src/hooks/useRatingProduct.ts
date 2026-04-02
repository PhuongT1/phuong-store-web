"use client";

import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import { getRatingList, postData } from "@/services/rating.service";
import { type PaginatedRating, type Rating, type RatingVariables } from "@/types";

const useRatingInfinite = (variables: RatingVariables) => {
	const getKey = (_pageIndex: number, previousPageData: PaginatedRating<Rating> | null) => {
		if (!variables.id) return null;

		const cursor = previousPageData?.pageInfo.endCursor || null;
		return { ...variables, after: cursor };
	};

	const { data, ...rest } = useSWRInfinite(getKey, {
		fetcher: async (variables: RatingVariables) => getRatingList(variables)
	});

	const pages = data ?? [];
	const hasNextPage = pages[pages.length - 1]?.pageInfo?.hasNextPage ?? false;

	const ratings = pages?.flatMap((page) => page.data);
	const remainingItems =
		pages.length > 0 ? Number(pages[pages.length - 1]?.summary?.totalCount) - ratings.length : 0;
	const summary = pages[pages.length - 1]?.summary;

	return { ...rest, ratings: ratings, summary, hasNextPage, remainingItems };
};

const useMuteProduct = () => {
	return useSWRMutation("post-review", postData);
};

export { useRatingInfinite, useMuteProduct };
