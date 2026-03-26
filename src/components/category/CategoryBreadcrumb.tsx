"use client";

import { ChevronRight, Home } from "lucide-react";
import { LinkWithChannel } from "@components/navigation";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";

type CategoryBreadcrumbProps = {
	category: ProductListByCategoryPaginatedQuery["category"];
};

const CategoryBreadcrumb = ({ category }: CategoryBreadcrumbProps) => {
	if (!category) return null;

	return (
		<nav aria-label="Breadcrumb" className="py-4">
			<ol className="flex items-center gap-2 text-sm">
				{/* Home */}
				<li>
					<LinkWithChannel
						href="/"
						className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-gray-900"
					>
						<Home className="h-4 w-4" />
						<span>Trang chủ</span>
					</LinkWithChannel>
				</li>

				<li className="text-gray-400">
					<ChevronRight className="h-4 w-4" />
				</li>

				{/* Current category */}
				<li>
					<span className="font-medium text-gray-900">{category.name}</span>
				</li>
			</ol>
		</nav>
	);
};

export { CategoryBreadcrumb };
