"use client";

import useSWR from "swr";
import {
	SearchProductsDocument,
	type SearchProductsQuery,
	type SearchProductsQueryVariables,
	OrderDirection,
	ProductOrderField
} from "@/gql/graphql";
import { clientFetchGraphQL } from "@/lib/api/clientGraphQLWithRetry";

const useSearchSuggestions = (query: string, channel: string) => {
	const trimmed = query.trim();
	const enabled = trimmed.length >= 2;

	const variables: SearchProductsQueryVariables = {
		search: trimmed,
		sortBy: ProductOrderField.Rank,
		sortDirection: OrderDirection.Desc,
		first: 6,
		channel
	};

	const { data, isLoading } = useSWR<SearchProductsQuery>(
		enabled ? [String(SearchProductsDocument), variables] : null,
		([doc, vars]) =>
			clientFetchGraphQL(SearchProductsDocument, { variables: vars as SearchProductsQueryVariables }),
		{ keepPreviousData: true }
	);

	return {
		products: data?.products?.edges.map((e) => e.node) ?? [],
		isLoading
	};
};

export { useSearchSuggestions };
