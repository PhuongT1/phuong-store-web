import { Skeleton } from "./Skeleton";

const ProductSortSkeleton = () => {
	return (
		<div className="bg-card mb-4 flex rounded-lg p-3">
			<div className="flex w-[0px] flex-1 gap-3">
				<Skeleton className="h-7 w-[110px]" />
				{Array.from({ length: 4 })?.map((_, index) => (
					<Skeleton className="h-7 w-[130px]" key={index} />
				))}
			</div>
		</div>
	);
};
ProductSortSkeleton.displayName = "ProductSortSkeleton";

export { ProductSortSkeleton };
