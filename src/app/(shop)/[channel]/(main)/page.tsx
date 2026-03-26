import { executeGraphQL } from "@lib/api/fetchGraphQL";
import { HomePageSections } from "./HomePageSections";
import { ProductListPaginatedDocument, type ProductListPaginatedQueryVariables } from "@/gql/graphql";
import { PRODUCTS_PER_PAGE } from "@/constants";
import { type PageQueryProps } from "@/types";

export const metadata = {
	title: "Trang chủ",
	description: "Trang chủ của trang web thương mại điện tử"
};

export default async function Page({ params }: PageQueryProps) {
	const { channel } = await params;

	const variables: ProductListPaginatedQueryVariables = {
		after: null,
		channel,
		first: PRODUCTS_PER_PAGE
	};

	const data = await executeGraphQL(ProductListPaginatedDocument, { variables });
	const products = data.products?.edges.map(({ node }) => node) ?? [];

	return <HomePageSections products={products} />;
}
