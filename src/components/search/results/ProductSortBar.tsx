"use client";

import { useTranslations } from "next-intl";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { useAddQueryParams } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
	{ key: "featured" as const, field: ProductOrderField.Rating, direction: OrderDirection.Desc },
	{ key: "priceAsc" as const, field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc },
	{ key: "priceDesc" as const, field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc },
	{ key: "newest" as const, field: ProductOrderField.PublishedAt, direction: OrderDirection.Desc }
];

const ProductSortBar = () => {
	const t = useTranslations("search.sort");
	const { setParams, parseParamUrl } = useAddQueryParams();
	const { sortBy } = parseParamUrl();
	const activeField = sortBy?.field as string | undefined;
	const activeDir = sortBy?.direction as string | undefined;

	const handleSort = (field: ProductOrderField, direction: OrderDirection) => {
		setParams({ sortBy: { field, direction } });
	};

	return (
		<div className="border-border bg-card/95 sticky top-(--header-height) z-30 mb-5 rounded-xl border px-3 py-2 backdrop-blur-sm">
			<div className="flex flex-wrap items-center">
				<span className="text-foreground mr-3 text-xs font-semibold tracking-[0.1em] uppercase">
					{t("label")}:
				</span>
				{SORT_OPTIONS.map((opt, i) => {
					const isActive = activeField === opt.field && activeDir === opt.direction;
					return (
						<span key={opt.key} className="flex items-center">
							{i > 0 && (
								<span className={cn("mx-2 text-[8px]", isActive ? "text-foreground" : "text-border")}>●</span>
							)}
							<button
								type="button"
								onClick={() => handleSort(opt.field, opt.direction)}
								className={cn(
									"py-1 text-sm font-medium transition-colors",
									isActive ? "text-info font-semibold" : "text-muted-foreground hover:text-foreground"
								)}
							>
								{t(opt.key)}
							</button>
						</span>
					);
				})}
			</div>
		</div>
	);
};

export { ProductSortBar };
