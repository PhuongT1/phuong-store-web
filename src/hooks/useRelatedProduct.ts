"use client";

import useSWR from "swr";
import { ProductListDocument, type ProductListQuery, type ProductListQueryVariables } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

const useRelatedProduct = (variables: ProductListQueryVariables) => {
	const { data, ...rest } = useSWR<ProductListQuery>(
		variables.filter?.ids && variables.filter?.ids.length > 0 && [ProductListDocument, variables],
		{
			fetcher: ([document, variables]) =>
				executeGraphQL(String(document), { variables }) as Promise<ProductListQuery>
		}
	);

	return { ...rest, data: data?.products?.edges.map((item) => item.node) };
};

export { useRelatedProduct };
