"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@ui";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { useAddQueryParams } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ProductFilter } from "@components/product";

const SORT_OPTIONS = [
	{ key: "featured" as const, field: ProductOrderField.Rating, direction: OrderDirection.Desc },
	{ key: "priceAsc" as const, field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc },
	{ key: "priceDesc" as const, field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc },
	{ key: "newest" as const, field: ProductOrderField.PublishedAt, direction: OrderDirection.Desc }
];

type ProductSortBarProps = {
	/** Optional product count shown on desktop right side */
	resultCount?: number;
};

const ProductSortBar = ({ resultCount }: ProductSortBarProps) => {
	const t = useTranslations("search.sort");
	const tf = useTranslations("filter");
	const tc = useTranslations("common");
	const { setParams, parseParamUrl } = useAddQueryParams();
	const { sortBy } = parseParamUrl();
	const activeField = sortBy?.field as string | undefined;
	const activeDir = sortBy?.direction as string | undefined;
	const [filterOpen, setFilterOpen] = useState(false);

	const handleSort = (field: ProductOrderField, direction: OrderDirection) => {
		setParams({ sortBy: { field, direction } });
	};

	return (
		<>
			<div className="surface-panel sticky top-[var(--header-height,88px)] z-30 mb-4 md:mb-5 [transform:translate3d(0,calc(var(--header-shift,0px)*-1),0)] transition-transform duration-300 ease-in-out will-change-transform motion-reduce:transition-none">
				{/* ── Mobile: horizontal scroll chips with fixed Filter button ── */}
				<div className="relative flex items-center pr-[108px] md:hidden">
					<div className="flex min-w-0 [touch-action:pan-x] items-center gap-2 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{SORT_OPTIONS.map((opt) => {
							const isActive = activeField === opt.field && activeDir === opt.direction;
							return (
								<button
									key={opt.key}
									type="button"
									onClick={() => handleSort(opt.field, opt.direction)}
									className={cn(
										"shrink-0 rounded-full border border-transparent px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors sm:px-3.5 sm:text-[13px]",
										isActive
											? "bg-primary text-primary-foreground shadow-sm"
											: "bg-transparent text-muted-foreground hover:border-border/80 hover:bg-accent/70 hover:text-foreground"
									)}
								>
									{t(opt.key)}
								</button>
							);
						})}
					</div>

					{/* Fixed Filter chip pinned right */}
					<div className="from-card/0 via-card/92 to-card pointer-events-none absolute top-0 right-0 bottom-0 flex w-[112px] items-center justify-end rounded-r-2xl bg-gradient-to-r pr-3 pl-3">
						<button
							type="button"
							onClick={() => setFilterOpen(true)}
							className="bg-card/96 text-foreground hover:bg-accent border-border/80 pointer-events-auto flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border pr-4 pl-3.5 text-[12px] font-semibold whitespace-nowrap shadow-sm transition-colors sm:text-[13px]"
						>
							<SlidersHorizontal className="h-3.5 w-3.5" />
							{tf("title")}
						</button>
					</div>
				</div>

				{/* ── Desktop: text-link style + optional result count ── */}
				<div className="hidden items-center justify-between px-4 py-2.5 md:flex">
					<div className="flex items-center">
						<span className="text-foreground mr-3 text-[11px] font-semibold tracking-[0.1em] uppercase">
							{t("label")}:
						</span>
						{SORT_OPTIONS.map((opt, i) => {
							const isActive = activeField === opt.field && activeDir === opt.direction;
							return (
								<span key={opt.key} className="flex items-center">
									{i > 0 && (
										<span className={cn("mx-2 text-[8px]", isActive ? "text-foreground" : "text-border")}>
											●
										</span>
									)}
									<button
										type="button"
										onClick={() => handleSort(opt.field, opt.direction)}
										className={cn(
											"py-1 text-[13px] lg:text-sm font-medium transition-colors",
											isActive ? "text-info font-semibold" : "text-muted-foreground hover:text-foreground"
										)}
									>
										{t(opt.key)}
									</button>
								</span>
							);
						})}
					</div>
					{resultCount !== undefined && (
						<span className="text-muted-foreground shrink-0 text-[13px] lg:text-sm">
							<span className="text-foreground font-semibold">{resultCount}</span> {tc("products")}
						</span>
					)}
				</div>
			</div>

			{/* ── Filter Drawer (mobile) — Vaul/shadcn style ── */}
			<Drawer open={filterOpen} onOpenChange={setFilterOpen}>
				<DrawerContent
					onOpenAutoFocus={(event) => event.preventDefault()}
					className="surface-overlay flex h-[60svh] max-h-[60svh] flex-col gap-0 overflow-hidden rounded-t-[24px] border-t p-0 [contain:layout_paint]"
				>
					<DrawerHeader className="border-border/65 bg-popover/90 shrink-0 border-b px-3 pt-2.5 pb-2 sm:px-4">
						<DrawerTitle className="leading-none text-[15px] font-semibold sm:text-base">
							{tf("title")}
						</DrawerTitle>
					</DrawerHeader>
					<div className="min-h-0 flex-1 overflow-hidden">
						<ProductFilter onClickBtnSubmit={() => setFilterOpen(false)} />
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export { ProductSortBar };
