import { Skeleton } from "@components/skeleton";

const HeaderSkeleton = () => {
	return (
		<div className="flex w-full flex-col">
			<nav className="flex h-12 w-full items-center justify-between gap-x-4 md:gap-x-8">
				{/* 1. Logo Skeleton */}
				<div className="flex shrink-0 items-center gap-2">
					<Skeleton className="h-10 w-10 rounded-xl" />
					<div className="hidden flex-col gap-1 md:flex">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-2 w-16" />
					</div>
				</div>

				{/* 2. Search Bar Skeleton */}
				<div className="flex flex-1 items-center justify-center px-4 md:px-8">
					<Skeleton className="h-10 w-full max-w-4xl rounded-full" />
				</div>

				{/* 3. Icons Skeleton */}
				<div className="flex items-center justify-end gap-2 md:gap-4">
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-8 w-8 rounded-full" />
				</div>
			</nav>

			{/* 4. Category Strip Skeleton */}
			<div className="hidden border-t border-gray-100/50 pt-1 pb-1 md:block">
				<div className="flex gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-8 w-24 rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
};
HeaderSkeleton.displayName = "HeaderSkeleton";

export { HeaderSkeleton };
