import { ImageSkeleton } from "@components/skeleton";

const ProductSwiperSkeleton = () => {
	return (
		<>
			<ImageSkeleton
				imageProps={{
					size: 220,
					strokeWidth: 0.2
				}}
				skeletonProps={{ className: "aspect-square w-full rounded-2xl" }}
			/>
			<div className="flex w-full gap-2 overflow-hidden">
				{Array.from({ length: 5 }).map((_, index) => (
					<ImageSkeleton
						skeletonProps={{ className: "h-16 w-16 rounded-xl sm:h-20 sm:w-20" }}
						imageProps={{ size: 56 }}
						key={index}
					/>
				))}
			</div>
		</>
	);
};
export { ProductSwiperSkeleton };
