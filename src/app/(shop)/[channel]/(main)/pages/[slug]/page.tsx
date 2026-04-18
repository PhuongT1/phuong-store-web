import { notFound } from "next/navigation";
import edjsHTML from "editorjs-html";
import { type Metadata } from "next";
import { ContainerLayout } from "@/components/layouts";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { buildMetadata, resolveMetadataValue } from "@/lib/metadata";
import { RenderRichText } from "@components/product";

const parser = edjsHTML();

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		next: {
			revalidate: 60
		}
	});

	return buildMetadata({
		title: resolveMetadataValue(page?.seoTitle, page?.title, "Page"),
		description: resolveMetadataValue(page?.seoDescription, page?.title)
	});
};

export default async function Page({ params }: { params: { slug: string } }) {
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		next: {
			revalidate: 60
		}
	});

	if (!page) {
		notFound();
	}

	const { title, content } = page;

	return (
		<ContainerLayout className="p-8 pb-16">
			<h1 className="text-3xl font-semibold">{title}</h1>
			<RenderRichText item={content} />
		</ContainerLayout>
	);
}
