import { cn } from "@/lib/utils";
import { ProductFilterSkeleton } from "./ProductFilterSkeleton";
import { ProductListSkeleton } from "./ProductListSkeleton";
import { ProductSortSkeleton } from "./ProductSortSkeleton";
import { Skeleton } from "./Skeleton";

type CatalogResultsSkeletonProps = {
	mode?: "search" | "collection" | "default";
	className?: string;
};

const SearchResultsHeaderSkeleton = () => (
	<div className="border-border/70 bg-card/96 mb-3 rounded-2xl border p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-5">
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex-1 space-y-2">
				<Skeleton className="h-3 w-28 rounded-full" />
				<Skeleton className="h-8 w-48 rounded-lg sm:h-9 sm:w-64" />
				<Skeleton className="h-4 w-24 rounded-full" />
			</div>
			<div className="hidden items-center gap-2 sm:flex">
				<Skeleton className="h-9 w-9 rounded-xl" />
				<Skeleton className="h-9 w-9 rounded-xl" />
			</div>
		</div>
	</div>
);

const CollectionHeadingSkeleton = () => (
	<div className="pb-3 pt-2 sm:pb-5 sm:pt-3">
		<Skeleton className="h-8 w-40 rounded-lg sm:h-10 sm:w-56" />
	</div>
);

const CatalogResultsSkeleton = ({ mode = "default", className }: CatalogResultsSkeletonProps) => {
	return (
		<div className={cn("py-2 sm:py-3", className)}>
			{mode === "collection" && <CollectionHeadingSkeleton />}
			{mode === "search" && <SearchResultsHeaderSkeleton />}

			<div className="mt-3 flex w-full items-start gap-4 md:mt-4 md:gap-6">
				<div className="hidden w-1/4 max-w-[280px] shrink-0 md:block">
					<ProductFilterSkeleton />
				</div>
				<div className="min-w-0 flex-1">
					<ProductSortSkeleton />
					<ProductListSkeleton />
				</div>
			</div>
		</div>
	);
};

CatalogResultsSkeleton.displayName = "CatalogResultsSkeleton";

export { CatalogResultsSkeleton };
