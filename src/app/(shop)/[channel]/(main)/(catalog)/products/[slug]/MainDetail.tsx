import { type Product, type WithContext } from "schema-dts";
import { DiscountedElement, RenderRichText, UndiscountedElement, VariantSelector } from "@components/product";
import { MainProductLayout } from "@components/layouts";
import { AddButton } from "./actions/AddButton";
import { type SlugPageProps } from "./page";
import { HandleRatingSummary } from "./feature/rating/HandleRatingSummary";
import { type ProductItem, getProductPrice } from "@/lib/utils";
import { AvailabilityMessage } from "@/ui/components";
import { ProductImageCarousel } from "@/ui/atoms/ProductImageCarousel";

type MainDetailProps = ProductItem & Pick<SlugPageProps, "params">;

const MainDetail = ({ product, selectedVariantID, params }: MainDetailProps) => {
	if (!product) return <></>;
	const { variants } = product;

	const { price, discounted, priceUndiscounted, selectedVariant, isAvailable, media } = getProductPrice({
		product,
		selectedVariantID
	});

	const productJsonLd: WithContext<Product> = {
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

	return (
		<MainProductLayout isBg={false}>
			{/* <Loading /> */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd)
				}}
			/>
			<div className="detail-grid">
				<div className="detail-content">
					{media && media.length > 0 && <ProductImageCarousel media={media} />}
				</div>
				<div className="detail-sidebar">
					<h1 className="mb-4 flex-auto text-3xl font-medium tracking-tight text-neutral-900">
						{product?.name}
					</h1>
					<HandleRatingSummary product={product} />
					<p
						className="text-price mb-8 flex flex-col gap-1 text-2xl font-medium"
						data-testid="ProductElement_Price"
					>
						{price}
						{selectedVariant?.pricing?.onSale && (
							<span className="flex gap-1">
								<UndiscountedElement className="text-sm font-medium" priceUndiscounted={priceUndiscounted} />
								<DiscountedElement className="text-sm font-medium" discounted={discounted} />
							</span>
						)}
					</p>
					{variants && (
						<VariantSelector
							selectedVariant={selectedVariant}
							variants={variants}
							product={product}
							channel={params.channel}
						/>
					)}
					<AvailabilityMessage isAvailable={isAvailable} />
					<div className="my-5">
						<AddButton
							variants={variants}
							selectedVariantID={selectedVariantID ?? ""}
							channel={params.channel}
							disabled={(!selectedVariantID || !selectedVariant?.quantityAvailable) && variants?.length !== 1}
						/>
					</div>
					<RenderRichText item={product?.description} />
				</div>
				<div className="detail-content">
					{product.attributes.map((item) => (
						<div key={item.attribute.id}>
							{item.values && (
								<div className="mt-8 space-y-6 text-sm">
									{item.values.map((product, index) => (
										<RenderRichText key={index} item={product.richText} />
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</MainProductLayout>
	);
};

export { MainDetail };
