"use client";

import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { LinkWithChannel } from "@components/navigation";

type CategoryBreadcrumbProps = {
	category: ProductListByCategoryPaginatedQuery["category"];
};

const CategoryBreadcrumb = ({ category }: CategoryBreadcrumbProps) => {
	const t = useTranslations("category");
	if (!category) return null;

	return (
		<nav aria-label="Breadcrumb" className="py-4">
			<ol className="flex items-center gap-2 text-sm">
				{/* Home */}
				<li>
					<LinkWithChannel
						href="/"
						className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
					>
						<Home className="h-4 w-4" />
						<span>{t("home")}</span>
					</LinkWithChannel>
				</li>

				<li className="text-muted-foreground">
					<ChevronRight className="h-4 w-4" />
				</li>

				{/* Current category */}
				<li>
					<span className="text-foreground font-medium">{category.name}</span>
				</li>
			</ol>
		</nav>
	);
};

export { CategoryBreadcrumb };
