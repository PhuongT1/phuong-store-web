import { ImageSkeleton } from "@components/skeleton";

const ProductSwiperSkeleton = () => {
	return (
		<>
			<ImageSkeleton
				imageProps={{
					size: 200,
					strokeWidth: 0.2
				}}
				skeletonProps={{ className: "h-[250px] sm:h-[370px] rounded-xl" }}
			/>
			<div className="flex w-full gap-2 overflow-hidden">
				{Array.from({ length: 20 })?.map((_, index) => (
					<ImageSkeleton skeletonProps={{ className: "rounded" }} imageProps={{ size: 60 }} key={index} />
				))}
			</div>
		</>
	);
};
export { ProductSwiperSkeleton };
