import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { ProductDetailsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { resolvePageQuery } from "@/lib/utils";
import { type Pages, type ProductPageQueryProps } from "@/types";
import { ProductFeature } from "./feature/ProductFeature";
import { MainDetail } from "./MainDetail";

export type SlugPageProps = {
	params: Pages;
	searchParams: { variant?: string };
};

export async function generateMetadata(
	props: ProductPageQueryProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { resolvedParams: params, resolvedSearchParams: searchParams } = await resolvePageQuery(props);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel
		}
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const productNameAndVariant = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${product.name} | ${product.seoTitle || (await parent).title?.absolute}`,
		description: product.seoDescription || productNameAndVariant,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined
		},
		openGraph: product.thumbnail
			? {
					images: [
						{
							url: product.thumbnail.url,
							alt: product.name
						}
					]
				}
			: null
	};
}

export default async function Page(props: ProductPageQueryProps) {
	const { resolvedParams: params, resolvedSearchParams: searchParams } = await resolvePageQuery(props);
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel
		},
		cache: "no-cache"
	});

	if (!product) {
		notFound();
	}
	const selectedVariantID = searchParams.variant;

	return (
		<>
			<MainDetail product={product} selectedVariantID={selectedVariantID} params={params} />
			<ProductFeature product={product} params={params} attributes={product.attributes} />
		</>
	);
}
