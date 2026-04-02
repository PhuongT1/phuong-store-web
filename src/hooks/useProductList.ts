"use client";

import { PRODUCTS_PER_PAGE } from "@/constants";
import {
	ProductListPaginatedDocument,
	type ProductListPaginatedQuery,
	type ProductListPaginatedQueryVariables,
	type ProductFragment
} from "@/gql/graphql";
import { type Channel } from "@/types";
import { CONFIG_SWR_KEYS } from "@config/keys";
import { useInfiniteProductList } from "./useInfiniteProductList";

type ProductListPaginate = ProductListPaginatedQuery["products"];

const useProductListInfinite = ({ channel }: Channel) => {
	return useInfiniteProductList<
		ProductListPaginatedQuery,
		ProductListPaginatedQueryVariables,
		ProductFragment
	>(
		{
			document: ProductListPaginatedDocument,
			cacheKey: CONFIG_SWR_KEYS.PRODUCT_SEARCH_LIST,
			extractProducts: (page) => page.products ?? null,
			buildVariables: ({ after, channel, parsedParams }) => ({
				after,
				channel,
				first: PRODUCTS_PER_PAGE,
				...parsedParams
			})
		},
		{ channel }
	);
};

export { useProductListInfinite, type ProductListPaginate };
