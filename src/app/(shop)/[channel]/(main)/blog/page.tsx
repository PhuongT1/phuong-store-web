import { type Metadata } from "next";
import { ContainerLayout } from "@/components/layouts";
import { BlogList } from "@/components/blog";
import { SITE_CONFIG } from "@/config/site";
import { SAMPLE_BLOG_POSTS } from "@/lib/blog-samples";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
	title: "Blog",
	description: `Tin tức, hướng dẫn và cảm hứng thời trang từ ${SITE_CONFIG.name}.`
});

type PageProps = {
	params: Promise<{ channel: string }>;
};

export default async function BlogIndexPage({ params }: PageProps) {
	const { channel } = await params;

	return (
		<>
			{/* Vibrant hero banner */}
			<div className="from-primary/10 via-info/5 to-success/10 border-border border-b bg-gradient-to-r">
				<ContainerLayout className="py-12">
					<p className="text-primary mb-1 text-xs font-semibold tracking-[0.2em] uppercase">
						{SITE_CONFIG.name}
					</p>
					<h1 className="text-foreground text-3xl font-medium sm:text-4xl">Blog &amp; Cẩm nang</h1>
					<p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
						Tin tức, hướng dẫn chọn giày và cảm hứng thời trang mỗi tuần.
					</p>
				</ContainerLayout>
			</div>

			<ContainerLayout className="py-10">
				<BlogList channel={channel} posts={SAMPLE_BLOG_POSTS} />
			</ContainerLayout>
		</>
	);
}
