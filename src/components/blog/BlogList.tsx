import { type PageFragment } from "@/gql/graphql";
import { BlogCard } from "./BlogCard";

type BlogListProps = {
	posts: PageFragment[];
	channel: string;
};

const BlogList = ({ posts, channel }: BlogListProps) => {
	if (posts.length === 0) {
		return (
			<p className="text-muted-foreground py-16 text-center text-sm">
				Chưa có bài viết nào. Quay lại sau nhé!
			</p>
		);
	}

	const [featured, ...rest] = posts;

	return (
		<div className="flex flex-col gap-6">
			{/* Featured first post — full width hero */}
			<BlogCard key={featured.id} channel={channel} post={featured} featured />

			{/* Remaining posts — 3-col grid */}
			{rest.length > 0 && (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{rest.map((post) => (
						<BlogCard key={post.id} channel={channel} post={post} />
					))}
				</div>
			)}
		</div>
	);
};

BlogList.displayName = "BlogList";

export { BlogList, type BlogListProps };
