import Image from "next/image";
import Link from "next/link";
import { type PageFragment } from "@/gql/graphql";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { BLOG_META, type BlogTagColor } from "@/lib/blog-samples";

type BlogCardProps = {
	post: PageFragment;
	channel: string;
	/** Render as a wide hero card (image left, text right) */
	featured?: boolean;
};

const TAG_STYLES: Record<BlogTagColor, string> = {
	info: "bg-info/15 text-info border-info/30",
	destructive: "bg-destructive/15 text-destructive border-destructive/30",
	success: "bg-success/15 text-success border-success/30",
	warning: "bg-warning/15 text-warning-foreground border-warning/30"
};

const BlogCard = ({ post, channel, featured = false }: BlogCardProps) => {
	const href = `/${channel}${routes.blog.post(post.slug)}`;
	const meta = BLOG_META[post.slug];

	return (
		<article
			className={cn(
				"bg-card border-border group flex flex-col overflow-hidden border",
				featured && "sm:flex-row"
			)}
		>
			{/* Cover image */}
			<div
				className={cn(
					"relative overflow-hidden",
					featured ? "aspect-[3/2] sm:aspect-auto sm:w-1/2" : "aspect-[16/9]"
				)}
			>
				{meta?.coverUrl ? (
					<Image
						src={meta.coverUrl}
						alt={post.title}
						fill
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="from-muted to-muted/50 h-full w-full bg-gradient-to-br" />
				)}
				{/* Category badge */}
				{meta?.tag && (
					<span
						className={cn(
							"absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm",
							TAG_STYLES[meta.tagColor]
						)}
					>
						{meta.tag}
					</span>
				)}
			</div>

			{/* Body */}
			<div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "sm:justify-center sm:gap-4 sm:p-8")}>
				<h2
					className={cn(
						"text-foreground group-hover:text-primary line-clamp-2 leading-snug font-medium transition-colors",
						featured ? "text-xl sm:text-2xl" : "text-base"
					)}
				>
					{post.title}
				</h2>
				{post.seoDescription && (
					<p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{post.seoDescription}</p>
				)}
				<div className="mt-auto pt-2">
					<Link
						href={href}
						className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase transition-colors"
						aria-label={`Đọc bài: ${post.title}`}
					>
						Đọc thêm
						<span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</article>
	);
};

BlogCard.displayName = "BlogCard";

export { BlogCard, type BlogCardProps };
