import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

type ProductElementSkeletonProps = {
	className?: string;
};

const ProductElementSkeleton = ({ className }: ProductElementSkeletonProps) => {
	return (
		<li
			data-testid="ProductElement"
			className={cn(
				"group bg-card relative flex flex-col overflow-hidden rounded-xl border border-border shadow-sm",
				className
			)}
		>
			{/* Image — mirrors real card: bg-product-image-bg relative aspect-square overflow-hidden */}
			<div className="bg-product-image-bg relative aspect-square shrink-0 overflow-hidden">
				<Skeleton className="absolute inset-0 h-full w-full rounded-none" />
			</div>
			{/* Content — matches flex-1 flex-col gap-2 p-3 of real card */}
			<div className="flex flex-1 flex-col gap-2 p-3">
				{/* Product name (2 lines) — matches text-base leading-snug line-clamp-2 */}
				<Skeleton className="h-5 w-full rounded" />
				<Skeleton className="h-5 w-3/4 rounded" />
				{/* Price — matches text-xl font-bold */}
				<Skeleton className="h-7 w-28 rounded" />
				{/* Rating + sold — matches text-sm */}
				<Skeleton className="h-4 w-32 rounded" />
				{/* Spec chips — matches py-0.5 px-1.5 text-xs */}
				<div className="flex flex-wrap gap-1">
					<Skeleton className="h-5 w-16 rounded" />
					<Skeleton className="h-5 w-14 rounded" />
				</div>
				{/* Variant pills — matches mt-3 border-t pt-3, pills: py-1 px-3 text-xs */}
				<div className="mt-3 border-t border-border pt-3">
					<div className="flex flex-wrap gap-1.5">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-6 w-12 rounded-lg" />
						))}
					</div>
				</div>
				{/* Add to cart button — mt-auto matches real card py-2.5 */}
				<Skeleton className="mt-auto h-10 w-full rounded-xl" />
			</div>
		</li>
	);
};
ProductElementSkeleton.displayName = "ProductElementSkeleton";

export { ProductElementSkeleton };
