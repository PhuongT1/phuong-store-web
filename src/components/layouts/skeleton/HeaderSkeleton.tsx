import { Skeleton } from "@components/skeleton";

const HeaderSkeleton = () => {
	return (
		<div className="flex w-full flex-col">
			{/* Row 1: matches Nav h-14 */}
			<div className="flex h-14 w-full items-center justify-between gap-x-4">
				{/* Logo */}
				<div className="flex shrink-0 items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<div className="hidden flex-col gap-1 md:flex">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-2 w-14" />
					</div>
				</div>

				{/* Search Bar */}
				<div className="max-w-2xl min-w-0 flex-1 px-2 md:px-4">
					<Skeleton className="h-10 w-full rounded-full" />
				</div>

				{/* Action Icons */}
				<div className="border-border/50 flex shrink-0 items-center gap-2 border-l pl-2 sm:gap-2 lg:pl-4">
					<Skeleton className="hidden h-8 w-14 rounded-full sm:block" />
					<Skeleton className="hidden h-8 w-8 rounded-full sm:block" />
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-8 w-20 rounded-md" />
				</div>
			</div>

			{/* Row 2: Desktop nav links — matches Nav h-11 */}
			<div className="hidden h-11 items-center justify-center gap-6 md:flex">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-4 w-24 rounded" />
				))}
			</div>
		</div>
	);
};
HeaderSkeleton.displayName = "HeaderSkeleton";

export { HeaderSkeleton };
