import { type PageGetBySlugQuery } from "@/gql/graphql";

type PageListProps = { pages: PageGetBySlugQuery["page"][] };
type Channel = { channel: string };
type Slug = { slug: string };
type Pages = Channel & Slug;
type SearchParamsPage = Record<string, string | string[]>;

type PageParams = {
	params: Pages;
};
type PageSearchParams = {
	searchParams: SearchParamsPage;
};
interface PageQueryProps<P = Pages, S = SearchParamsPage> {
	params: Promise<P>;
	searchParams: Promise<S>;
}

export {
	type PageQueryProps,
	type Pages,
	type Channel,
	type Slug,
	type PageListProps,
	type PageParams,
	type PageSearchParams,
	type SearchParamsPage
};
