import { type Metadata } from "next";
import { PRODUCTS_PER_PAGE } from "@/constants";
import { ProductListPaginatedDocument, type ProductListPaginatedQueryVariables } from "@/gql/graphql";
import { generatePageMetadata } from "@/lib/metadata";
import { type PageQueryProps } from "@/types";
import { executeGraphQL } from "@lib/api/fetchGraphQL";
import { HomePageSections } from "./HomePageSections";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("home");

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
