import { ProductListSkeleton } from "../../skeleton/ProductListSkeleton";
import { ProductElement } from "../product-detail/ProductElement";
import { cn } from "@/lib/utils";
import { type ProductListProps } from "@/types";

const ProductList = ({ products, className, isLoading = false, viewMode = "grid" }: ProductListProps) => {
	return (
		<>
			{isLoading ? (
				<ProductListSkeleton />
			) : (
				<ul
					role="list"
					data-testid="ProductList"
					className={cn(
						viewMode === "list"
							? "grid grid-cols-1 gap-2"
						: "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-3 lg:gap-3 xl:grid-cols-4 xl:gap-3",
						className
					)}
				>
					{products?.map((product, index) => (
						<ProductElement
							key={`${product?.id}_${index}`}
							product={product}
							priority={index < 2}
							loading={index < 3 ? "eager" : "lazy"}
						/>
					))}
				</ul>
			)}
		</>
	);
};

export { ProductList };
