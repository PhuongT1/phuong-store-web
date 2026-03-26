"use client";

import { LinkWithChannel } from "@components/navigation";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";

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
		<section className="border-t border-gray-200 bg-gray-50 py-12">
			<div className="mx-auto max-w-4xl px-6">
				<h2 className="mb-4 text-2xl font-semibold text-gray-900">About {category.name}</h2>

				{category.description && (
					<div className="mb-6 text-base leading-relaxed text-gray-600">
						<p>{category.description}</p>
					</div>
				)}

				<div className="mb-6">
					<p className="text-base leading-relaxed text-gray-600">
						Discover our extensive collection of {category.name.toLowerCase()} with{" "}
						<span className="font-semibold text-gray-900">{category.products?.totalCount || 0} products</span>{" "}
						to choose from. We offer the latest styles, premium quality, and competitive prices to ensure you
						find exactly what you&apos;re looking for.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
						Related Categories
					</h3>
					<div className="flex flex-wrap gap-3">
						{relatedCategories.map((cat) => (
							<LinkWithChannel
								key={cat.slug}
								href={`/categories/${cat.slug}`}
								className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
							>
								{cat.name}
							</LinkWithChannel>
						))}
					</div>
				</div>

				{category.seoDescription && (
					<div className="mt-8 border-t border-gray-200 pt-8">
						<p className="text-sm leading-relaxed text-gray-500">{category.seoDescription}</p>
					</div>
				)}
			</div>
		</section>
	);
};

export { CategoryDescription };
