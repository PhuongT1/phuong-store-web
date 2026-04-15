import { cn } from "@/lib/utils";
import { ImageSkeleton } from "./ImageSkeleton";
import { Skeleton } from "./Skeleton";

type ProductElementSkeletonProps = {
	className?: string;
};

const ProductElementSkeleton = ({ className }: ProductElementSkeletonProps) => {
	return (
		<li
			data-testid="ProductElement"
			className={cn(
				"group product-card-premium bg-card/98 relative flex flex-col overflow-hidden rounded-2xl border border-border/70 shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.78)]",
				className
			)}
		>
			<ImageSkeleton
				skeletonProps={{
					className: "aspect-square w-full shrink-0 rounded-none"
				}}
				imageProps={{
					size: 120,
					strokeWidth: 0.25
				}}
			/>
			<div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-3.5">
				<Skeleton className="h-5 w-full rounded" />
				<Skeleton className="h-5 w-3/4 rounded" />
				<Skeleton className="h-7 w-28 rounded" />
				<div className="flex flex-wrap gap-1">
					<Skeleton className="h-5 w-16 rounded" />
					<Skeleton className="h-5 w-14 rounded" />
				</div>
				<div className="mt-3 min-h-[54px] border-t border-border/60 pt-3">
					<div className="flex flex-wrap gap-1.5">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-6 w-12 rounded-lg" />
						))}
					</div>
				</div>
				<Skeleton className="h-4 w-32 rounded" />
				<Skeleton className="mt-auto h-10 w-full rounded-xl sm:h-11" />
			</div>
		</li>
	);
};
ProductElementSkeleton.displayName = "ProductElementSkeleton";

export { ProductElementSkeleton };
