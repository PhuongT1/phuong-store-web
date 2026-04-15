"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Grid2X2, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type SearchResultsHeaderProps = {
	searchQuery?: string;
	totalResults: number;
	isLoading?: boolean;
};

const SearchResultsHeader = ({ searchQuery, totalResults, isLoading }: SearchResultsHeaderProps) => {
	const t = useTranslations("search");
	const tc = useTranslations("common");
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
		<div className="surface-panel mb-3 p-4 sm:p-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				{/* Left: Search info */}
				<div className="flex-1">
					{searchQuery ? (
						<div>
							<p className="text-muted-foreground text-[11px] uppercase tracking-[0.12em]">{t("searchResultsFor")}</p>
							<h1 className="text-foreground mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
								&quot;{searchQuery}&quot;
							</h1>
							<p className="text-muted-foreground mt-1 text-[13px] sm:text-sm">
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
							<h1 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">{t("allProducts")}</h1>
							<p className="text-muted-foreground mt-1 text-[13px] sm:text-sm">
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
					{/* Grid/List toggle */}
					<div className="divide-border border-border hidden items-center divide-x overflow-hidden rounded-xl border sm:flex">
						<button
							type="button"
							onClick={() => handleViewToggle("grid")}
							className={cn(
								"flex h-9 w-9 items-center justify-center transition-colors",
								viewMode === "grid"
									? "bg-primary text-primary-foreground"
									: "bg-card text-muted-foreground hover:bg-accent"
							)}
							aria-label="Grid view"
						>
							<Grid2X2 className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => handleViewToggle("list")}
							className={cn(
								"flex h-9 w-9 items-center justify-center transition-colors",
								viewMode === "list"
									? "bg-primary text-primary-foreground"
									: "bg-card text-muted-foreground hover:bg-accent"
							)}
							aria-label="List view"
						>
							<List className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SearchResultsHeader };
