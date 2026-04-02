"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@components/navigation";
import { ProductCardImage } from "./ProductCardImage";
import { ProductCardPrice } from "./ProductCardPrice";
import { ProductCardVariants } from "./ProductCardVariants";
import { useProductCard } from "./useProductCard";

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
	const t = useTranslations("product");
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
				"group bg-card relative flex flex-col overflow-hidden rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-lg",
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

				<div className="flex flex-1 flex-col gap-2 p-3">
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
							"mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
							isInStock
								? "border border-info/30 bg-info/5 text-info hover:border-info hover:bg-info/10 disabled:opacity-50"
								: "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
						)}
					>
						{!isInStock ? (
							t("outOfStock")
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
								{t("adding")}
							</>
						) : (
							<>
								<ShoppingCart className="h-4 w-4" />
								{t("addToCart")}
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
