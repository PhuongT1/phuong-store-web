"use client";

import useSWRInfinite from "swr/infinite";
import { type TypedDocumentString } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { useAddQueryParams } from "@/lib/hooks";

type ProductConnection<TNode> = {
	pageInfo: { hasNextPage: boolean; endCursor?: string | null };
	totalCount?: number | null;
	edges: { node: TNode }[];
};

type InfiniteProductListConfig<
	TQuery,
	TVariables,
	TNode,
	TMeta extends Record<string, unknown> = Record<string, never>
> = {
	document: TypedDocumentString<TQuery, TVariables>;
	cacheKey: string;
	extractProducts: (page: TQuery) => ProductConnection<TNode> | null | undefined;
	buildVariables: (params: {
		after: string | null;
		channel: string;
		slug?: string;
		parsedParams: Record<string, unknown>;
	}) => TVariables;
	initialData?: TQuery[];
	extractMeta?: (firstPage: TQuery) => TMeta;
};

type InfiniteProductListParams = {
	channel: string;
	slug?: string;
};

function useInfiniteProductList<
	TQuery,
	TVariables,
	TNode,
	TMeta extends Record<string, unknown> = Record<string, never>
>(config: InfiniteProductListConfig<TQuery, TVariables, TNode, TMeta>, params: InfiniteProductListParams) {
	const { parseParamUrl } = useAddQueryParams();

	const getKey = (_pageIndex: number, previousPageData: TQuery | null): [string, TVariables] | null => {
		if (previousPageData) {
			const connection = config.extractProducts(previousPageData);
			if (!connection?.pageInfo.hasNextPage) return null;
		}

		const after = previousPageData
			? (config.extractProducts(previousPageData)?.pageInfo.endCursor ?? null)
			: null;

		return [
			config.cacheKey,
			config.buildVariables({
				after,
				channel: params.channel,
				slug: params.slug,
				parsedParams: parseParamUrl()
			})
		];
	};

	const { data, ...rest } = useSWRInfinite(
		getKey,
		 
		([, variables]: any) =>
			executeGraphQL(config.document.toString(), {
				variables,
				withAuth: false
			}),
		{
			fallbackData: config.initialData,
			keepPreviousData: true,
			revalidateOnMount: false
		}
	);

	const pages = (data ?? config.initialData ?? []);
	const lastPage = pages[pages.length - 1];
	const lastConnection = lastPage ? config.extractProducts(lastPage) : null;

	const hasNextPage = lastConnection?.pageInfo.hasNextPage ?? false;
	const totalCount = Number(lastConnection?.totalCount ?? 0);

	const products: TNode[] = pages.flatMap(
		(page) => config.extractProducts(page)?.edges.map((edge) => edge.node) ?? []
	);

	const remainingCount = Math.max(0, totalCount - products.length);
	const meta = (pages[0] && config.extractMeta ? config.extractMeta(pages[0]) : {}) as TMeta;

	return { products, hasNextPage, remainingCount, ...meta, ...rest };
}

export { useInfiniteProductList, type InfiniteProductListConfig, type InfiniteProductListParams };
