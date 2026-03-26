"use client";

import useSWRInfinite from "swr/infinite";
import {
	ProductListByCollectionPaginatedDocument,
	type ProductListByCollectionPaginatedQuery,
	type ProductListByCollectionPaginatedQueryVariables
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { type Pages } from "@/types";
import { PRODUCTS_PER_PAGE, PRODUCT_SORT_BY_DEFAULT } from "@/constants";
import { useAddQueryParams } from "@/lib/hooks";

type ProductList = ProductListByCollectionPaginatedQuery;
type Variables = ProductListByCollectionPaginatedQueryVariables;

type ProductParams<TResult = ProductList, TVariables = Variables> = {
	initialData?: ProductList;
} & Pages;

const useProductListByCollectionInfinite = ({ channel, initialData, slug }: ProductParams) => {
	const { getQueryParams } = useAddQueryParams();
	// The getKey function determines the key for each page
	const getKey = (
		_pageIndex: number,
		previousPageData: ProductList
	): [typeof ProductListByCollectionPaginatedDocument, Variables] | null => {
		// If there are no more pages, return null
		if (previousPageData && !previousPageData.collection?.products?.pageInfo.hasNextPage) return null;
		const cursor = previousPageData?.collection?.products?.pageInfo.endCursor || null; // Simplified cursor logic

		return [
			ProductListByCollectionPaginatedDocument, // GraphQL query
			{
				slug,
				first: PRODUCTS_PER_PAGE,
				after: cursor,
				channel,
				sortBy: {
					...PRODUCT_SORT_BY_DEFAULT,
					...getQueryParams()
				}
			}
		];
	};

	// Use useSWRInfinite to fetch paginated data
	const { data, ...rest } = useSWRInfinite(getKey, {
		fetcher: async ([, variables]) =>
			executeGraphQL(ProductListByCollectionPaginatedDocument.toString(), { variables }),
		fallbackData: initialData ? [initialData] : undefined,
		revalidateOnMount: false
	});

	// Process the data and extract products
	const pages = data ?? (initialData ? [initialData] : []); // Ensure pages is never undefined
	const hasNextPage = pages[pages.length - 1]?.collection?.products?.pageInfo.hasNextPage ?? false;
	const products = pages.flatMap((page) => page.collection?.products?.edges.map((edge) => edge.node) ?? []);

	const remainingCount = Number(pages[pages.length - 1]?.collection?.products?.totalCount) - products.length;

	return { products, hasNextPage, remainingCount, ...rest };
};

export { useProductListByCollectionInfinite };
