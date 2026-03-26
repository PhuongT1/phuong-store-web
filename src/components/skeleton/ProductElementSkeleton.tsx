import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

type ProductElementSkeletonProps = {
	className?: string;
};

const ProductElementSkeleton = ({ className }: ProductElementSkeletonProps) => {
	return (
		<li
			data-testid="ProductElement"
			className={cn(
				"group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm",
				className
			)}
		>
			{/* Image skeleton — full width, no padding */}
			<Skeleton className="aspect-square w-full rounded-none" />
			{/* Content skeleton — matches p-2.5 padding of real card */}
			<div className="flex flex-col gap-2 p-2.5">
				{/* Price */}
				<Skeleton className="h-5 w-24" />
				{/* Name */}
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
				{/* Stars */}
				<Skeleton className="h-3 w-20" />
				{/* Button */}
				<Skeleton className="mt-1 h-9 w-full rounded-xl" />
			</div>
		</li>
	);
};
ProductElementSkeleton.displayName = "ProductElementSkeleton";

export { ProductElementSkeleton };
