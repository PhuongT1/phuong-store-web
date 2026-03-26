"use client";

import { ShoppingCart } from "lucide-react";

import { LinkWithChannel } from "@components/navigation";

import { ProductCardImage } from "./ProductCardImage";
import { ProductCardPrice } from "./ProductCardPrice";
import { ProductCardVariants } from "./ProductCardVariants";
import { PRODUCT_CARD_STRINGS } from "./productCard.constants";
import { useProductCard } from "./useProductCard";
import { cn } from "@/lib/utils";
import { type ProductDetailsQuery } from "@/gql/graphql";

type ProductCardProps = {
	loading: "eager" | "lazy";
	priority?: boolean;
	className?: string;
} & ProductDetailsQuery;

type NonNullProduct = NonNullable<ProductDetailsQuery["product"]>;

// Inner component always receives a valid product — hooks called unconditionally
const ProductCardInner = ({
	product,
	loading,
	priority,
	className
}: {
	product: NonNullProduct;
	loading: "eager" | "lazy";
	priority?: boolean;
	className?: string;
}) => {
	const {
		variants,
		selectedVariantId,
		isAddingToCart,
		variantImage,
		price,
		discounted,
		priceUndiscounted,
		isInStock,
		isOnSale,
		savingsFormatted,
		soldCount,
		ratingValue,
		specChips,
		handleVariantSelect,
		handleAddToCart
	} = useProductCard(product);

	return (
		<li
			data-testid="ProductElement"
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md hover:ring-gray-200",
				className
			)}
		>
			<LinkWithChannel href={`/products/${product.slug}`} className="flex h-full flex-col">
				<ProductCardImage
					product={product}
					loading={loading}
					priority={priority}
					isOnSale={isOnSale}
					variantImage={variantImage}
				/>

				<div className="flex flex-1 flex-col gap-2 p-2.5">
					<ProductCardPrice
						name={product.name}
						price={price}
						discounted={discounted}
						priceUndiscounted={priceUndiscounted}
						isOnSale={isOnSale}
						savingsFormatted={savingsFormatted}
						ratingValue={ratingValue}
						soldCount={soldCount}
						specChips={specChips}
					/>

					<ProductCardVariants
						variants={variants}
						selectedVariantId={selectedVariantId}
						onSelect={handleVariantSelect}
					/>

					{/* Add to cart — always visible, active variant aware */}
					<button
						onClick={handleAddToCart}
						disabled={isAddingToCart || !isInStock}
						className={cn(
							"mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]",
							isInStock
								? "bg-zinc-800 text-white hover:bg-zinc-900 disabled:opacity-50"
								: "cursor-not-allowed bg-gray-100 text-gray-400"
						)}
					>
						{!isInStock ? (
							PRODUCT_CARD_STRINGS.outOfStock
						) : isAddingToCart ? (
							<>
								<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								{PRODUCT_CARD_STRINGS.adding}
							</>
						) : (
							<>
								<ShoppingCart className="h-4 w-4" />
								{PRODUCT_CARD_STRINGS.addToCart}
							</>
						)}
					</button>
				</div>
			</LinkWithChannel>
		</li>
	);
};

// Null-guard wrapper — renders nothing when product is absent
const ProductCard = ({ product, loading, priority, className }: ProductCardProps) => {
	if (!product) return null;
	return <ProductCardInner product={product} loading={loading} priority={priority} className={className} />;
};

// Backward-compatible alias
const ProductElement = ProductCard;

export { ProductCard, ProductElement };
