import { cn } from "@/lib/utils";
import { type ProductListProps } from "@/types";
import { ProductListSkeleton } from "../../skeleton/ProductListSkeleton";
import { ProductElement } from "../product-detail/ProductElement";

const ProductList = ({ products, className, isLoading = false, viewMode = "grid" }: ProductListProps) => {
	return (
		<>
			{/* <ProductListSkeleton /> */}
			{isLoading ? (
				<ProductListSkeleton />
			) : (
				<ul
					role="list"
					data-testid="ProductList"
					className={cn(
						viewMode === "list"
							? "product-grid-premium grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 lg:gap-4"
							: "product-grid-premium grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4 lg:gap-4",
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
