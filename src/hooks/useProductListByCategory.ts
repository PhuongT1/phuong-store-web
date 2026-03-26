"use client";

import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { executeGraphQL } from "@lib/api/fetchGraphQL";
import { useAddQueryParams } from "@lib/hooks";
import { CONFIG_SWR_KEYS } from "@config/keys";
import {
	ProductListByCategoryPaginatedDocument,
	ProductListByCollectionDocument,
	type ProductListByCategoryPaginatedQuery,
	type ProductListByCategoryPaginatedQueryVariables,
	type ProductListByCollectionQueryVariables,
	type ProductListByCollectionQuery
} from "@/gql/graphql";
import { type Pages } from "@/types";
import { PRODUCTS_PER_PAGE } from "@/constants";

type ProductListByCategory = ProductListByCategoryPaginatedQuery;
type Variables = ProductListByCategoryPaginatedQueryVariables;

type ProductParams = {
	initialData?: ProductListByCategory;
} & Pages;

const useProductListByCategoryInfinite = ({ channel, initialData, slug }: ProductParams) => {
	const { parseParamUrl } = useAddQueryParams();

	const getKey = (
		_pageIndex: number,
		previousPageData: ProductListByCategory | null
	): [typeof ProductListByCategoryPaginatedDocument, Variables] | null => {
		if (previousPageData && !previousPageData.category?.products?.pageInfo.hasNextPage) return null;

		const cursor = previousPageData?.category?.products?.pageInfo.endCursor || null;
		return [
			ProductListByCategoryPaginatedDocument, // GraphQL query
			{
				slug,
				first: PRODUCTS_PER_PAGE,
				after: cursor,
				channel,
				...parseParamUrl()
			}
		];
	};

	const { data, ...rest } = useSWRInfinite(getKey, {
		fallbackData: initialData ? [initialData] : undefined,
		revalidateOnMount: false
	});

	const pages = data ?? (initialData ? [initialData] : []);
	const hasNextPage = pages[pages.length - 1]?.category?.products?.pageInfo.hasNextPage ?? false;
	const products = pages.flatMap((page) => page.category?.products?.edges.map((edge) => edge.node) ?? []);
	const remainingCount = Number(pages[pages.length - 1]?.category?.products?.totalCount) - products.length;
	const category = pages[0]?.category ?? null;

	return {
		...rest,
		products,
		category,
		hasNextPage,
		remainingCount
		// isLoading:isLoadingSWR
	};
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
