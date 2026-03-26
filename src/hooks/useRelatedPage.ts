"use client";

import useSWR from "swr";
import { PageListDocument, type PageListQuery, type PageListQueryVariables } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

const useRelatedPage = (variables: PageListQueryVariables) => {
	const { data, ...rest } = useSWR<PageListQuery>(
		variables.filter?.ids && variables.filter?.ids.length > 0 && [PageListDocument, variables],
		{
			fetcher: ([document, variables]) => {
				return executeGraphQL(String(document), { variables }) as Promise<PageListQuery>;
			}
		}
	);

	return { ...rest, data: data?.pages?.edges.map((item) => item.node) };
};

export { useRelatedPage };
