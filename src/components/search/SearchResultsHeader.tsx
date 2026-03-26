"use client";

import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@components/ui";
import { cn } from "@/lib/utils";

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
		<div className="mb-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				{/* Left: Search info */}
				<div className="flex-1">
					{searchQuery ? (
						<div>
							<p className="text-xs text-gray-400">Kết quả tìm kiếm cho</p>
							<h1 className="mt-0.5 text-lg font-semibold tracking-tight text-gray-900">
								&quot;{searchQuery}&quot;
							</h1>
							<p className="mt-0.5 text-sm text-gray-500">
								{isLoading ? (
									<span className="animate-pulse">Đang tải...</span>
								) : (
									<>
										<span className="font-semibold text-gray-900">{totalResults}</span> sản phẩm
									</>
								)}
							</p>
						</div>
					) : (
						<div>
							<h1 className="text-lg font-semibold tracking-tight text-gray-900">Tất cả sản phẩm</h1>
							<p className="mt-0.5 text-sm text-gray-500">
								{isLoading ? (
									<span className="animate-pulse">Đang tải...</span>
								) : (
									<>
										<span className="font-semibold text-gray-900">{totalResults}</span> sản phẩm
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
						className="rounded-lg border-gray-300 md:hidden"
						onClick={onFilterClick}
					>
						<SlidersHorizontal className="mr-2 h-4 w-4" />
						Bộ lọc
					</Button>

					{/* Grid/List toggle */}
					<div className="hidden items-center divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 sm:flex">
						<button
							type="button"
							onClick={() => handleViewToggle("grid")}
							className={cn(
								"flex h-8 w-8 items-center justify-center transition-colors",
								viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
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
								viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
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
