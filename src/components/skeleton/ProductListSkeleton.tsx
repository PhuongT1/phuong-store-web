"use client";

import { cn } from "@/lib/utils";
import { useDeviceSize } from "@hooks/useDeviceSize";
import { ProductElementSkeleton } from "./ProductElementSkeleton";

const ProductListSkeleton = () => {
	const { isMobile, isTablet } = useDeviceSize();

	const productList = () => {
		if (isMobile) return 2;
		else if (isTablet) return 3;
		return 4;
	};

	const getClassName = (index: number) => {
		switch (index) {
			case 2:
				return "lg:block hidden";
			case 3:
				return "md:block hidden";
			default:
				return "";
		}
	};
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-3 lg:gap-3 xl:grid-cols-4", {})}
		>
			{Array.from({ length: 4 })?.map((_, index) => (
				<ProductElementSkeleton key={index} className={getClassName(index)} />
			))}
		</ul>
	);
};
ProductListSkeleton.displayName = "ProductListSkeleton";

export { ProductListSkeleton };
