"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui";

type SearchResultsHeaderProps = {
	searchQuery?: string;
	totalResults: number;
	isLoading?: boolean;
	onFilterClick?: () => void;
};

const SearchResultsHeader = ({
	searchQuery,
	totalResults,
	isLoading,
	onFilterClick
}: SearchResultsHeaderProps) => {
	const t = useTranslations("search");
	const tc = useTranslations("common");
	const tf = useTranslations("filter");
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const viewMode = searchParams?.get("view") ?? "grid";

	const handleViewToggle = (mode: "grid" | "list") => {
		const params = new URLSearchParams(searchParams?.toString() ?? "");
		params.set("view", mode);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="border-border bg-card mb-3 rounded-xl border p-5 shadow-sm">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				{/* Left: Search info */}
				<div className="flex-1">
					{searchQuery ? (
						<div>
							<p className="text-muted-foreground text-xs">{t("searchResultsFor")}</p>
							<h1 className="text-foreground mt-0.5 text-lg font-semibold tracking-tight">
								&quot;{searchQuery}&quot;
							</h1>
							<p className="text-muted-foreground mt-0.5 text-sm">
								{isLoading ? (
									<span className="animate-pulse">{tc("loading")}</span>
								) : (
									<>
										<span className="text-foreground font-semibold">{totalResults}</span> {tc("products")}
									</>
								)}
							</p>
						</div>
					) : (
						<div>
							<h1 className="text-foreground text-lg font-semibold tracking-tight">{t("allProducts")}</h1>
							<p className="text-muted-foreground mt-0.5 text-sm">
								{isLoading ? (
									<span className="animate-pulse">{tc("loading")}</span>
								) : (
									<>
										<span className="text-foreground font-semibold">{totalResults}</span> {tc("products")}
									</>
								)}
							</p>
						</div>
					)}
				</div>

				{/* Right: Actions */}
				<div className="flex items-center gap-2">
					{/* Filter button (mobile) */}
					<Button
						variant="outline"
						size="sm"
						className="border-border rounded-lg md:hidden"
						onClick={onFilterClick}
					>
						<SlidersHorizontal className="mr-2 h-4 w-4" />
						{tf("title")}
					</Button>

					{/* Grid/List toggle */}
					<div className="divide-border border-border hidden items-center divide-x overflow-hidden rounded-lg border sm:flex">
						<button
							type="button"
							onClick={() => handleViewToggle("grid")}
							className={cn(
								"flex h-8 w-8 items-center justify-center transition-colors",
								viewMode === "grid"
									? "bg-primary text-primary-foreground"
										: "bg-card text-muted-foreground hover:bg-accent"
							)}
							aria-label="Grid view"
						>
							<Grid2X2 className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							onClick={() => handleViewToggle("list")}
							className={cn(
								"flex h-8 w-8 items-center justify-center transition-colors",
								viewMode === "list"
									? "bg-primary text-primary-foreground"
								: "bg-card text-muted-foreground hover:bg-accent"
							)}
							aria-label="List view"
						>
							<List className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SearchResultsHeader };
