import { Skeleton } from "./Skeleton";

const ProductSortSkeleton = () => {
	return (
		<div className="bg-card/94 border-border/60 mb-4 overflow-hidden rounded-2xl border p-3 shadow-[0_8px_24px_rgba(0,0,0,0.05)] md:mb-5 md:px-4 md:py-2.5">
			<div className="flex min-w-0 items-center gap-2 overflow-hidden md:hidden">
				{Array.from({ length: 3 }).map((_, index) => (
					<Skeleton className="h-8 w-[84px] shrink-0 rounded-full" key={index} />
				))}
				<div className="ml-auto">
					<Skeleton className="h-9 w-[92px] rounded-xl" />
				</div>
			</div>
			<div className="hidden items-center justify-between gap-4 md:flex">
				<div className="flex min-w-0 items-center gap-3 overflow-hidden">
					<Skeleton className="h-4 w-[72px] shrink-0 rounded-full" />
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton className="h-5 w-[112px] shrink-0 rounded-full" key={index} />
					))}
				</div>
				<Skeleton className="h-4 w-20 shrink-0 rounded-full" />
			</div>
		</div>
	);
};
ProductSortSkeleton.displayName = "ProductSortSkeleton";

export { ProductSortSkeleton };
