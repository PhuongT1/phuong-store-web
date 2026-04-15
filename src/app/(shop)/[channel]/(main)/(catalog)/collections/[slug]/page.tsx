import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { PRODUCTS_PER_PAGE } from "@/constants";
import {
	ProductListByCollectionPaginatedDocument,
	type ProductListByCollectionPaginatedQueryVariables
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { type ResolvedQueryProps, parseParams, resolvePageQuery } from "@/lib/utils";
import { type PageQueryProps } from "@/types";
import { ProductListLayout } from "@components/layouts";
import { ProductSortBar } from "@components/product";
import { ProductListByCollection } from "../ProductListByCollection";

const variables = ({
	resolvedParams,
	resolvedSearchParams
}: ResolvedQueryProps): ProductListByCollectionPaginatedQueryVariables => {
	const { channel, slug } = resolvedParams;
	const data = parseParams(resolvedSearchParams);
	return {
		slug,
		channel,
		first: PRODUCTS_PER_PAGE,
		after: null,
		...data
	};
};

const fetchCollectionData = async (params: ResolvedQueryProps) => {
	const result = await executeGraphQL(ProductListByCollectionPaginatedDocument, {
		variables: variables(params)
	});

	if (!result.collection || !result.collection.products) {
		throw new Error("Collection data or products are missing");
	}

	return result;
};

export const generateMetadata = async (props: ResolvedQueryProps): Promise<Metadata> => {
	try {
		const { collection } = await fetchCollectionData(props);
		if (!collection) return {};

		return {
			title: `${collection.name || "Collection"}${collection.seoTitle ? ` | ${collection.seoTitle}` : ""}`,
			description:
				collection.seoDescription || collection.description || collection.seoTitle || collection.name
		};
	} catch (error) {
		return {};
	}
};

export default async function Page(props: PageQueryProps) {
	const pageQuery = await resolvePageQuery(props);
	const {
		resolvedParams: { channel, slug }
	} = pageQuery;
	try {
		const data = await fetchCollectionData(pageQuery);
		const { collection } = data;

		if (collection && !collection.products) {
			return <></>;
		}
		return (
			<>
				<ProductListLayout textHeading={collection?.name}>
					<ProductSortBar />
					<ProductListByCollection products={data} channel={channel} slug={slug} />
				</ProductListLayout>
			</>
		);
	} catch (error) {
		notFound();
	}
}
