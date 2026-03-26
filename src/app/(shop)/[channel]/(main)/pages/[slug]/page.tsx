import { notFound } from "next/navigation";
import { type Metadata } from "next";
import edjsHTML from "editorjs-html";
import { RenderRichText } from "@components/product";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { ContainerLayout } from "@/components/layouts";

const parser = edjsHTML();

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		next: {
			revalidate: 60
		}
	});

	return {
		title: `${page?.seoTitle || page?.title || "Page"}`,
		description: page?.seoDescription || page?.seoTitle || page?.title
	};
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
