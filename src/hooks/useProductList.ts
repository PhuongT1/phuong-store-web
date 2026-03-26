"use client";

import useSWRInfinite from "swr/infinite";
import { useEffect } from "react";
import { CONFIG_SWR_KEYS } from "@config/keys";
import {
	ProductListPaginatedDocument,
	type ProductListPaginatedQuery,
	type ProductListPaginatedQueryVariables,
	type TypedDocumentString
} from "@/gql/graphql";
import { type Channel } from "@/types";
import { useAddQueryParams } from "@/lib/hooks";
import { PRODUCTS_PER_PAGE } from "@/constants";
import { executeGraphQL } from "@/lib/api";

type ProductListPaginate = ProductListPaginatedQuery["products"];

type ProductParams<TResult = ProductListPaginatedQuery, TVariables = ProductListPaginatedQueryVariables> = {
	operation?: TypedDocumentString<TResult, TVariables>;
} & Channel;

const useProductListInfinite = ({ channel }: ProductParams) => {
	const { parseParamUrl } = useAddQueryParams();

	const getKey = (
		_pageIndex: number,
		previousPageData: ProductListPaginatedQuery | null
	): [string, ProductListPaginatedQueryVariables] | null => {
		if (previousPageData && !previousPageData?.products?.pageInfo.hasNextPage) return null;
		const after = previousPageData?.products?.pageInfo.endCursor ?? null;

		return [
			CONFIG_SWR_KEYS.PRODUCT_SEARCH_LIST,
			{
				after,
				channel,
				first: PRODUCTS_PER_PAGE,
				...parseParamUrl()
			}
		];
	};

	const { data, ...rest } = useSWRInfinite(
		getKey,
		([, variables]) =>
			executeGraphQL(ProductListPaginatedDocument.toString(), { variables, withAuth: false }),
		{ keepPreviousData: true, revalidateOnMount: false }
	);

	const pages = data ?? [];
	const hasNextPage = pages[pages.length - 1]?.products?.pageInfo.hasNextPage ?? false;
	const products = pages.flatMap((page) => page.products?.edges.map((edge) => edge.node) ?? []);
	const totalCount = Number(pages[pages.length - 1]?.products?.totalCount ?? 0);
	const remainingCount = isNaN(totalCount) ? 0 : Math.max(0, totalCount - products.length);

	useEffect(() => {
		void rest.mutate(data, { revalidate: false });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { products, hasNextPage, remainingCount, ...rest };
};

export { useProductListInfinite, type ProductListPaginate };
