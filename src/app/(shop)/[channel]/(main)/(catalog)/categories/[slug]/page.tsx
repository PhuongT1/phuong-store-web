import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { CategoryHero, CategorySubcategories, CategoryBreadcrumb } from "@/components/category";
import { PRODUCTS_PER_PAGE } from "@/constants";
import {
	ProductListByCategoryPaginatedDocument,
	type ProductListByCategoryPaginatedQueryVariables
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { type ResolvedQueryProps, parseParams, resolvePageQuery } from "@/lib/utils";
import { type PageQueryProps } from "@/types";
import { CategoryPageClient } from "../CategoryPageClient";

const variables = ({
	resolvedParams,
	resolvedSearchParams
}: ResolvedQueryProps): ProductListByCategoryPaginatedQueryVariables => {
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

export const generateMetadata = async (props: PageQueryProps): Promise<Metadata> => {
	const pageQuery = await resolvePageQuery(props);
	try {
		const { category } = await executeGraphQL(ProductListByCategoryPaginatedDocument, {
			variables: variables(pageQuery)
		});

		if (!category) throw new Error("Category data is missing");

		return {
			title: `${category.name} ${category.seoTitle && ` | ${category.seoTitle}`}`,
			description: category.seoDescription || category.description || category.seoTitle || category.name
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {};
	}
};

export default async function Page(props: PageQueryProps) {
	const pageQuery = await resolvePageQuery(props);
	const { channel, slug } = pageQuery.resolvedParams;
	try {
		const data = await executeGraphQL(ProductListByCategoryPaginatedDocument, {
			variables: variables(pageQuery)
		});

		if (!data.category || !data.category.products) {
			notFound();
		}

		return (
			<div className="min-h-screen">
				{/* Breadcrumb Navigation */}
				<div>
					<div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
						<CategoryBreadcrumb category={data.category} />
					</div>
				</div>

				{/* Full-width Category Hero Banner */}
				<CategoryHero category={data.category} />

				{/* Subcategory Navigation */}
				<div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
					<CategorySubcategories category={data.category} />
				</div>

				{/* Product Grid + Discovery Sections */}
				<CategoryPageClient products={data} channel={channel} slug={slug} />
			</div>
		);
	} catch (error) {
		notFound();
	}
}
