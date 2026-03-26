import { Skeleton } from "./Skeleton";

const ProductRatingSkeleton = () => {
	return (
		<div className="bg-white p-3 md:rounded-lg md:p-5 md:pr-[30%]">
			<Skeleton className="h-9" />
			<div className="mt-10 flex items-center gap-3">
				<Skeleton className="h-8 w-[60px]" />
				<Skeleton className="h-4 w-[80px]" />
				<Skeleton className="h-4 w-[80px]" />
			</div>
			<div className="mb-14 mt-10 flex flex-col gap-3">
				{Array.from({ length: 5 })?.map((_, index) => (
					<div className="flex  items-center gap-3" key={index}>
						<Skeleton className="h-4 w-[30px]" />
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4  w-[60px]" />
					</div>
				))}
			</div>
			<Skeleton className="mb-4 h-12 w-1/2" />
		</div>
	);
};
ProductRatingSkeleton.displayName = "ProductRatingSkeleton";

export { ProductRatingSkeleton };
