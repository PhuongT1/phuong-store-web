"use client";

import { ChevronRight } from "lucide-react";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { LinkWithChannel } from "@components/navigation";

type CategorySubcategoriesProps = {
	category: ProductListByCategoryPaginatedQuery["category"];
};

const CategorySubcategories = ({ category }: CategorySubcategoriesProps) => {
	// Example subcategories (in production, these would come from the backend)
	const subcategories = [
		{ id: "1", name: "Caps", slug: "caps", count: 45 },
		{ id: "2", name: "Beanies", slug: "beanies", count: 32 },
		{ id: "3", name: "Bucket Hats", slug: "bucket-hats", count: 28 },
		{ id: "4", name: "Sports Hats", slug: "sports-hats", count: 56 },
		{ id: "5", name: "Winter Hats", slug: "winter-hats", count: 38 }
	];

	if (!category || subcategories.length === 0) return null;

	return (
		<section className="py-8">
			<div className="mb-6">
				<h2 className="text-foreground text-xl font-semibold tracking-tight">Shop by Category</h2>
				<p className="text-muted-foreground mt-1 text-sm">Browse our collection by style</p>
			</div>

			<div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
				{subcategories.map((subcategory) => (
					<LinkWithChannel
						key={subcategory.id}
						href={`/categories/${subcategory.slug}`}
						className="group min-w-[180px] shrink-0"
					>
						<div className="border-border bg-card flex h-full flex-col rounded-xl border p-5 shadow-sm transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-md">
							<div className="mb-3 flex items-center justify-between">
								<div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
									<div className="bg-muted-foreground/40 h-5 w-5 rounded-sm" />
								</div>
								<ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
							</div>
							<h3 className="text-foreground font-semibold">{subcategory.name}</h3>
							<p className="text-muted-foreground mt-1 text-xs">{subcategory.count} items</p>
						</div>
					</LinkWithChannel>
				))}
			</div>
		</section>
	);
};

export { CategorySubcategories };
