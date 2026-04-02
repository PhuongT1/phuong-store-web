"use client";

import useSWR from "swr";
import { PRODUCTS_PER_PAGE } from "@/constants";
import {
	ProductListByCategoryPaginatedDocument,
	ProductListByCollectionDocument,
	type ProductListByCategoryPaginatedQuery,
	type ProductListByCategoryPaginatedQueryVariables,
	type ProductListByCollectionQueryVariables,
	type ProductListByCollectionQuery,
	type ProductFragment
} from "@/gql/graphql";
import { type Pages } from "@/types";
import { CONFIG_SWR_KEYS } from "@config/keys";
import { executeGraphQL } from "@lib/api/fetchGraphQL";
import { useInfiniteProductList } from "./useInfiniteProductList";

type ProductListByCategory = ProductListByCategoryPaginatedQuery;

type ProductParams = {
	initialData?: ProductListByCategory;
} & Pages;

type CategoryMeta = { category: ProductListByCategoryPaginatedQuery["category"] | null };

const useProductListByCategoryInfinite = ({ channel, initialData, slug }: ProductParams) => {
	const result = useInfiniteProductList<
		ProductListByCategoryPaginatedQuery,
		ProductListByCategoryPaginatedQueryVariables,
		ProductFragment,
		CategoryMeta
	>(
		{
			document: ProductListByCategoryPaginatedDocument,
			cacheKey: CONFIG_SWR_KEYS.PRODUCT_CATEGORY_LIST,
			extractProducts: (page) => page.category?.products ?? null,
			buildVariables: ({ after, channel, slug, parsedParams }) => ({
				slug: slug!,
				first: PRODUCTS_PER_PAGE,
				after,
				channel,
				...parsedParams
			}),
			initialData: initialData ? [initialData] : undefined,
			extractMeta: (firstPage) => ({ category: firstPage.category ?? null })
		},
		{ channel, slug }
	);

	return result;
};

const useSignatureProduct = (variables: ProductListByCollectionQueryVariables) => {
	const { data, ...rest } = useSWR<ProductListByCollectionQuery>(
		[CONFIG_SWR_KEYS.PRODUCT_CATEGORY_LIST, variables],
		{
			fetcher: () =>
				executeGraphQL(ProductListByCollectionDocument.toString(), { variables, withAuth: false })
		}
	);

	return { ...rest, products: data?.collection?.products?.edges.map((edge) => edge.node) };
};

export { useProductListByCategoryInfinite, useSignatureProduct, type ProductListByCategory };
