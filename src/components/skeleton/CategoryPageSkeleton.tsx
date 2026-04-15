import { CatalogResultsSkeleton } from "./CatalogResultsSkeleton";
import { Skeleton } from "./Skeleton";

const DiscoverySectionSkeleton = () => (
	<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
		<div className="space-y-3">
			<Skeleton className="h-3 w-28 rounded-full" />
			<Skeleton className="h-8 w-56 rounded-lg" />
		</div>
		<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<Skeleton key={index} className="aspect-[0.76] rounded-2xl" />
			))}
		</div>
	</div>
);

const CategoryPageSkeleton = () => {
	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-20 rounded-full" />
					<Skeleton className="h-4 w-4 rounded-full" />
					<Skeleton className="h-4 w-32 rounded-full" />
				</div>
			</div>

			<div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
				<Skeleton className="min-h-[260px] w-full rounded-2xl sm:min-h-[320px] lg:min-h-[360px]" />
			</div>

			<div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
				<div className="py-8">
					<div className="mb-6 space-y-2">
						<Skeleton className="h-7 w-40 rounded-lg" />
						<Skeleton className="h-4 w-44 rounded-full" />
					</div>
					<div className="flex gap-3 overflow-hidden pb-4">
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className="h-24 w-[180px] shrink-0 rounded-xl" />
						))}
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
				<CatalogResultsSkeleton />
			</div>

			<DiscoverySectionSkeleton />
			<DiscoverySectionSkeleton />
			<DiscoverySectionSkeleton />

			<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-border/60 bg-card/96 p-5 sm:p-6">
					<Skeleton className="h-3 w-28 rounded-full" />
					<Skeleton className="mt-3 h-8 w-56 rounded-lg" />
					<div className="mt-4 space-y-2">
						<Skeleton className="h-4 w-full rounded-full" />
						<Skeleton className="h-4 w-full rounded-full" />
						<Skeleton className="h-4 w-5/6 rounded-full" />
					</div>
				</div>
			</div>
		</div>
	);
};

CategoryPageSkeleton.displayName = "CategoryPageSkeleton";

export { CategoryPageSkeleton };
