"use client";

import { PRODUCTS_PER_PAGE, PRODUCT_SORT_BY_DEFAULT } from "@/constants";
import {
	ProductListByCollectionPaginatedDocument,
	type ProductListByCollectionPaginatedQuery,
	type ProductListByCollectionPaginatedQueryVariables,
	type ProductFragment
} from "@/gql/graphql";
import { type Pages } from "@/types";
import { CONFIG_SWR_KEYS } from "@config/keys";
import { useInfiniteProductList } from "./useInfiniteProductList";

type ProductParams = {
	initialData?: ProductListByCollectionPaginatedQuery;
} & Pages;

const useProductListByCollectionInfinite = ({ channel, initialData, slug }: ProductParams) => {
	return useInfiniteProductList<
		ProductListByCollectionPaginatedQuery,
		ProductListByCollectionPaginatedQueryVariables,
		ProductFragment
	>(
		{
			document: ProductListByCollectionPaginatedDocument,
			cacheKey: CONFIG_SWR_KEYS.PRODUCT_COLLECTION_LIST,
			extractProducts: (page) => page.collection?.products ?? null,
			buildVariables: ({ after, channel, slug }) => ({
				slug: slug!,
				first: PRODUCTS_PER_PAGE,
				after,
				channel,
				sortBy: PRODUCT_SORT_BY_DEFAULT
			}),
			initialData: initialData ? [initialData] : undefined
		},
		{ channel, slug }
	);
};

export { useProductListByCollectionInfinite };
