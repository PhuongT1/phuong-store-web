import { type Pages, type SearchParamsPage, type PageQueryProps } from "@/types";

type ResolvedQueryProps<P = Pages, S = SearchParamsPage> = Awaited<ReturnType<typeof resolvePageQuery<P, S>>>;

const resolvePageQuery = async <P, S>({ params, searchParams }: PageQueryProps<P, S>) => {
	const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
	return { resolvedParams, resolvedSearchParams };
};

export { resolvePageQuery, type ResolvedQueryProps };
