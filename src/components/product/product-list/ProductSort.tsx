"use client";

import { useState } from "react";
import { Sheet, SheetContent, Button, DialogTitle } from "@ui";
import { FilterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { useAddQueryParams } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ProductFilter } from "./ProductFilter";

const SORT_OPTIONS = [
	{ key: "featured" as const, field: ProductOrderField.Rating, direction: OrderDirection.Desc },
	{ key: "priceAsc" as const, field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc },
	{ key: "priceDesc" as const, field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc },
	{ key: "newest" as const, field: ProductOrderField.PublishedAt, direction: OrderDirection.Desc }
];

type ProductSortProps = {
	resultCount?: number;
};

const ProductSort = ({ resultCount }: ProductSortProps) => {
	const tc = useTranslations("common");
	const ts = useTranslations("search.sort");
	const [isOpen, setOpen] = useState<boolean>(false);
	const { setParams, parseParamUrl } = useAddQueryParams();
	const { sortBy } = parseParamUrl();
	const activeField = sortBy?.field as string | undefined;
	const activeDir = sortBy?.direction as string | undefined;

	const handleSort = (field: ProductOrderField, direction: OrderDirection) => {
		setParams({ sortBy: { field, direction } });
	};

	return (
		<div className="border-border bg-card/95 sticky top-(--header-height) z-30 mb-5 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 backdrop-blur-sm">
			{/* Sort Options */}
			<div className="flex flex-wrap items-center">
				<span className="text-muted-foreground mr-3 hidden text-xs font-semibold tracking-[0.1em] uppercase sm:inline">
					{ts("label")}:
				</span>
				{SORT_OPTIONS.map((opt, i) => {
					const isActive = activeField === opt.field && activeDir === opt.direction;
					return (
						<span key={opt.key} className="flex items-center">
							{i > 0 && (
								<span className={cn("mx-2 text-[8px]", isActive ? "text-nav-active" : "text-border")}>●</span>
							)}
							<button
								type="button"
								onClick={() => handleSort(opt.field, opt.direction)}
								className={cn(
									"py-1 text-sm font-medium transition-colors",
									isActive ? "text-info font-semibold" : "text-muted-foreground hover:text-foreground"
								)}
							>
								{ts(opt.key)}
							</button>
						</span>
					);
				})}
			</div>

			{/* Right: Result count + mobile filter */}
			<div className="flex shrink-0 items-center gap-3">
				{resultCount !== undefined && (
					<span className="text-muted-foreground hidden text-sm sm:inline">
						<span className="text-foreground font-semibold">{resultCount}</span> {tc("products")}
					</span>
				)}
				<div className="block md:hidden">
					<Sheet open={isOpen} modal>
						<Button variant="icon" size="icon" onClick={() => setOpen(true)}>
							<FilterIcon size={20} />
						</Button>
						<SheetContent side={"bottom"} onCloseMenu={() => setOpen(false)}>
							<DialogTitle></DialogTitle>
							<ProductFilter onClickBtnSubmit={() => setOpen(false)} />
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
};

export { ProductSort };
