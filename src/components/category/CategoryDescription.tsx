"use client";

import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { LinkWithChannel } from "@components/navigation";

type CategoryDescriptionProps = {
	category: ProductListByCategoryPaginatedQuery["category"];
};

const CategoryDescription = ({ category }: CategoryDescriptionProps) => {
	if (!category) return null;

	// Example related categories (in real app, this would come from backend)
	const relatedCategories = [
		{ name: "Accessories", slug: "accessories" },
		{ name: "Footwear", slug: "footwear" },
		{ name: "Apparel", slug: "apparel" }
	];

	return (
		<section className="border-border border-t py-10 sm:py-12">
			<div className="mx-auto max-w-4xl px-4 sm:px-6">
				<h2 className="text-foreground mb-4 text-xl font-semibold sm:text-2xl">About {category.name}</h2>

				{category.description && (
					<div className="text-muted-foreground mb-5 text-sm leading-relaxed sm:mb-6 sm:text-base">
						<p>{category.description}</p>
					</div>
				)}

				<div className="mb-6">
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
						Discover our extensive collection of {category.name.toLowerCase()} with{" "}
						<span className="text-foreground font-semibold">
							{category.products?.totalCount || 0} products
						</span>{" "}
						to choose from. We offer the latest styles, premium quality, and competitive prices to ensure you
						find exactly what you&apos;re looking for.
					</p>
				</div>

				<div>
					<h3 className="text-muted-foreground mb-3 text-[11px] sm:text-sm font-semibold tracking-wider uppercase">
						Related Categories
					</h3>
					<div className="flex flex-wrap gap-3">
						{relatedCategories.map((cat) => (
							<LinkWithChannel
								key={cat.slug}
								href={`/categories/${cat.slug}`}
								className="border-border bg-card text-foreground hover:border-border/80 hover:bg-muted rounded-lg border px-4 py-2 text-[13px] sm:text-sm font-medium transition-all"
							>
								{cat.name}
							</LinkWithChannel>
						))}
					</div>
				</div>

				{category.seoDescription && (
					<div className="border-border mt-8 border-t pt-8">
						<p className="text-muted-foreground text-[13px] leading-relaxed sm:text-sm">{category.seoDescription}</p>
					</div>
				)}
			</div>
		</section>
	);
};

export { CategoryDescription };
