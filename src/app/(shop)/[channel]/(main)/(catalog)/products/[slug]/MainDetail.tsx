"use client";

import { useEffect, useMemo, useState } from "react";
import { type Product, type WithContext } from "schema-dts";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { type ProductItem, getProductPrice } from "@/lib/utils";
import { ProductImageCarousel } from "@/ui/atoms/ProductImageCarousel";
import { AvailabilityMessage } from "@/ui/components";
import { MainProductLayout } from "@components/layouts";
import { DiscountedElement, RenderRichText, UndiscountedElement, VariantSelector } from "@components/product";
import { ProductPurchaseActions } from "./actions/ProductPurchaseActions";
import { HandleRatingSummary } from "./feature/rating/HandleRatingSummary";
import { ProductRatingSection } from "./feature/rating/ProductRatingSection";
import { type SlugPageProps } from "./page";

type MainDetailProps = ProductItem & Pick<SlugPageProps, "params">;

const MainDetail = ({ product, selectedVariantID, params }: MainDetailProps) => {
	const [optimisticSelectedVariantID, setOptimisticSelectedVariantID] = useState(selectedVariantID ?? "");

	useEffect(() => {
		setOptimisticSelectedVariantID(selectedVariantID ?? "");
	}, [selectedVariantID]);

	const activeSelectedVariantID = optimisticSelectedVariantID || selectedVariantID || "";

	const productPricing = useMemo(
		() =>
			product
				? getProductPrice({
						product,
						selectedVariantID: activeSelectedVariantID
					})
				: {
						price: "",
						discounted: "",
						priceUndiscounted: "",
						selectedVariant: undefined,
						isAvailable: false,
						media: undefined
					},
		[activeSelectedVariantID, product]
	);
	const { price, discounted, priceUndiscounted, selectedVariant, isAvailable, media } = productPricing;

	const productJsonLd = useMemo<WithContext<Product> | null>(() => {
		if (!product) return null;

		return {
			"@context": "https://schema.org",
			"@type": "Product",
			image: product.thumbnail?.url,
			...(selectedVariant
				? {
						name: `${product.name} - ${selectedVariant.name}`,
						description: product.seoDescription || `${product.name} - ${selectedVariant.name}`,
						offers: {
							"@type": "Offer",
							availability: selectedVariant.quantityAvailable
								? "https://schema.org/InStock"
								: "https://schema.org/OutOfStock",
							priceCurrency: selectedVariant.pricing?.price?.gross.currency,
							price: selectedVariant.pricing?.price?.gross.amount
						}
					}
				: {
						name: product.name,
						description: product.seoDescription || product.name,
						offers: {
							"@type": "AggregateOffer",
							availability: product.variants?.some((variant) => variant.quantityAvailable)
								? "https://schema.org/InStock"
								: "https://schema.org/OutOfStock",
							priceCurrency: product.pricing?.priceRange?.start?.gross.currency,
							lowPrice: product.pricing?.priceRange?.start?.gross.amount,
							highPrice: product.pricing?.priceRange?.stop?.gross.amount
						}
					})
		};
	}, [product, selectedVariant]);

	if (!product || !productJsonLd) return <></>;
	const { variants } = product;

        return (
                <MainProductLayout isBg={false} containerClassName="max-w-6xl">
                        <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                        __html: JSON.stringify(productJsonLd)
                                }}
                        />
                        <div id="product-detail-grid" className="detail-grid">
                                <div className="detail-content">
                                        <ScrollReveal delay={0}>
						{media && media.length > 0 && (
							<ProductImageCarousel
								key={`${activeSelectedVariantID || "default"}-${media[0]?.url ?? "media"}`}
								media={media}
							/>
						)}
                                        </ScrollReveal>
                                </div>
                                <div className="detail-sidebar">
                                        <ScrollReveal delay={0.05}>
                                                <h1 className="text-foreground mb-2 flex-auto text-3xl leading-[1.1] font-semibold tracking-tight md:text-4xl lg:text-[40px]">
                                                        {product?.name}
                                                </h1>
                                                <HandleRatingSummary product={product} />
                                        </ScrollReveal>

                                        <ScrollReveal delay={0.1}>
                                                <div className="border-border/40 my-5 border-b pb-5 md:my-6 md:pb-6">
                                                        <p
                                                                className="flex flex-col gap-2 text-2xl font-medium tracking-tight text-[var(--price)] md:text-3xl"
                                                                data-testid="ProductElement_Price"
                                                        >
                                                                {price}
                                                                {selectedVariant?.pricing?.onSale && (
                                                                        <span className="flex items-center gap-3">
                                                                               <UndiscountedElement
                                                                               className="text-muted-foreground text-base font-normal line-through"
                                                                               priceUndiscounted={priceUndiscounted}
                                                                               />
                                                                               <DiscountedElement
                                                                               className="rounded bg-[var(--price)] px-2 py-1 text-sm font-medium text-[var(--price-foreground)]"
                                                                               discounted={discounted}
                                                                               />
                                                                        </span>
                                                                )}
                                                        </p>
                                                </div>
                                        </ScrollReveal>

                                        {variants && (
                                                <ScrollReveal delay={0.2}>
							<VariantSelector
								selectedVariant={selectedVariant}
								selectedVariantID={activeSelectedVariantID}
								variants={variants}
								product={product}
								channel={params.channel}
								onVariantChange={setOptimisticSelectedVariantID}
							/>
                                                </ScrollReveal>
                                        )}

                                        <ScrollReveal delay={0.3}>
						<div className="mt-5 mb-6 md:mt-6 md:mb-7">
							<AvailabilityMessage isAvailable={isAvailable} />
						</div>
                                        </ScrollReveal>

                                        <ScrollReveal delay={0.4}>
						<ProductPurchaseActions
							title={product.name}
							price={price}
							variants={variants}
							selectedVariantID={activeSelectedVariantID}
							channel={params.channel}
							disabled={(!activeSelectedVariantID || !selectedVariant?.quantityAvailable) && variants?.length !== 1}
						/>
                                        </ScrollReveal>
                                </div>

                                {/* Rating Section - immediately visible right after variants */}
                                <div className="col-span-1 md:col-span-10">
                                        <ScrollReveal delay={0.1}>
                                                <ProductRatingSection product={product} params={params} />
                                        </ScrollReveal>
                                </div>

                                {/* Full width Description and Attributes section */}
                                <div className="border-border/40 col-span-1 mt-8 border-t pt-8 md:col-span-10 md:mt-14 md:pt-10">
                                        <div className="mx-auto max-w-4xl space-y-8 px-4 md:space-y-10 md:px-6">
                                                {product?.description && (
                                                        <ScrollReveal delay={0.1}>
                                                                <div className="space-y-4 md:space-y-5">
                                                                        <RenderRichText item={product?.description} />
                                                                </div>
                                                        </ScrollReveal>
                                                )}
                                                {product.attributes && product.attributes.length > 0 && (
                                                        <div className="space-y-6 md:space-y-8">
                                                                {product.attributes.map((item, index) => (
                                                                        <ScrollReveal delay={0.1 + index * 0.1} key={item.attribute.id}>
                                                                                {item.values && (
                                                                                        <div className="text-sm">
                                                                                                {item.values.map((val, valIndex) => (
                                                                                                        <RenderRichText key={valIndex} item={val.richText} />
                                                                                                ))}
                                                                                        </div>
                                                                                )}
                                                                        </ScrollReveal>
                                                                ))}
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </div>
                </MainProductLayout>
        );
};

export { MainDetail };
