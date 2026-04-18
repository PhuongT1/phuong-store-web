"use client";

import { useId } from "react";
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
	const halfStarId = `${useId()}-half-star`;
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
		<li data-testid="ProductElement" className="h-full">
			<LinkWithChannel
				href={`/products/${product.slug}`}
				className={cn(
					"group product-card-premium surface-card surface-card-interactive relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+6px)]",
					className
				)}
			>
					<ProductCardImage
						product={product}
						loading={loading}
						priority={priority}
						isOnSale={isOnSale}
						variantImage={variantImage}
					/>

					<div className="border-border/55 bg-card/94 dark:bg-card/88 flex flex-1 flex-col gap-2.5 border-t p-3 sm:p-3.5">
						<ProductCardPrice
							name={product.name}
							price={price}
							discounted={discounted}
							priceUndiscounted={priceUndiscounted}
							isOnSale={isOnSale}
							savingsFormatted={savingsFormatted}
							specChips={specChips}
						/>

						<ProductCardVariants
							variants={variants}
							selectedVariantId={selectedVariantId}
							onSelect={handleVariantSelect}
						/>

						<div className="mt-auto">
							{/* Rating + sold count — social proof fixed at bottom before Add to Cart */}
							<div className="text-muted-foreground/92 mb-2 flex items-center px-0.5 text-[11px] sm:text-[13px]">
								<div className="mr-1 flex items-center gap-px">
									{Array.from({ length: 5 }).map((_, i) => {
										const val = ratingValue ?? 0;
										const full = Math.floor(val);
										// if val is 4.3, half is true because we'll just check if val - full > 0
										// but typically we only show half star if >= 0.25 and < 0.75, etc.
										const half = val - full >= 0.25 && val - full < 0.75;
										const up = val - full >= 0.75; // round up to full star

										if (val > 0) {
											if (i < full || (i === full && up)) {
												return (
													<svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
													</svg>
												);
											}
											if (i === full && half) {
												return (
													<svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={`url(#${halfStarId})`} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<defs>
															<linearGradient id={halfStarId}>
																<stop offset="50%" stopColor="#f59e0b" />
																<stop offset="50%" stopColor="transparent" />
															</linearGradient>
														</defs>
														<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
													</svg>
												);
											}
										}
										return (
											<svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-border/80" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
											</svg>
										);
									})}
								</div>
								{/* Numeric score — only when rating exists */}
								{(ratingValue ?? 0) > 0 && (
									<span className="mr-1 text-[11px] font-semibold text-amber-500 sm:text-xs">
										{ratingValue?.toFixed(1)}
									</span>
								)}
								{soldCount != null ? (
									<>
										<span className="mx-1 opacity-30">|</span>
										<span className="truncate">
											{t("soldPrefix")} {soldCount}
										</span>
									</>
								) : (
									<span className="cursor-default opacity-0">0</span> // Reserve height so cards align
								)}
							</div>

							{/* Add to cart — always visible, active variant aware */}
							<button
								onClick={handleAddToCart}
								disabled={isAddingToCart || !isInStock}
								className={cn(
									"product-card-cta mt-auto flex h-10 w-full items-center justify-center gap-1.5 truncate rounded-xl px-3 text-[13px] font-semibold transition-all duration-300 active:scale-[0.98] sm:h-11 sm:gap-2 sm:text-sm",
									isInStock
										? "border border-info/24 bg-linear-to-r from-info/9 via-info/11 to-info/9 text-info hover:border-info/42 hover:from-info/13 hover:to-info/11 hover:shadow-[0_14px_28px_-20px_rgba(56,189,248,0.72)] disabled:opacity-50 dark:border-info/30 dark:from-info/16 dark:via-info/14 dark:to-info/11"
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
