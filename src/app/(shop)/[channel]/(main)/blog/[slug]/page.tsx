import { notFound } from "next/navigation";
import Image from "next/image";
import { type Metadata } from "next";
import { ContainerLayout } from "@/components/layouts";
import { RenderRichText } from "@components/product";
import { SAMPLE_BLOG_POSTS, BLOG_META, TAG_STYLES_DETAIL } from "@/lib/blog-samples";

type PageProps = {
	params: Promise<{ channel: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = SAMPLE_BLOG_POSTS.find((p) => p.slug === slug);
	if (!post) return { title: "Blog — Phương Store" };
	return {
		title: post.seoTitle ?? post.title,
		description: post.seoDescription ?? post.title
	};
}

export default async function BlogPostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = SAMPLE_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
	if (!post) notFound();

	const meta = BLOG_META[slug];

	return (
		<>
			{/* Hero image */}
			{meta?.coverUrl && (
				<div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
					<Image src={meta.coverUrl} alt={post.title} fill priority className="object-cover" sizes="100vw" />
					<div className="from-background/70 absolute inset-0 bg-gradient-to-t to-transparent" />
					{meta.tag && (
						<div className="absolute bottom-6 left-1/2 -translate-x-1/2">
							<span
								className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${TAG_STYLES_DETAIL[meta.tagColor]}`}
							>
								{meta.tag}
							</span>
						</div>
					)}
				</div>
			)}

			<ContainerLayout className="py-10">
				<article className="mx-auto max-w-2xl">
					<header className="border-border mb-8 border-b pb-6">
						<h1 className="text-2xl leading-snug font-medium">{post.title}</h1>
						{post.seoDescription && (
							<p className="text-muted-foreground mt-3 text-base leading-relaxed">{post.seoDescription}</p>
						)}
					</header>
					<div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-7">
						<RenderRichText item={post.content} />
					</div>
				</article>
			</ContainerLayout>
		</>
	);
}
