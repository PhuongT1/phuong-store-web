"use client";

import { Heart } from "lucide-react";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

type Product = NonNullable<ProductDetailsQuery["product"]>;

type ProductCardImageProps = {
	product: Product;
	loading: "eager" | "lazy";
	priority?: boolean;
	isOnSale: boolean;
	/** First media item from the selected variant, or null to use product thumbnail */
	variantImage: { url: string; alt: string } | null;
};

const ProductCardImage = ({ product, loading, priority, isOnSale, variantImage }: ProductCardImageProps) => {
	const primaryUrl = variantImage?.url ?? product.thumbnail?.url;
	const primaryAlt = variantImage?.alt ?? product.thumbnail?.alt ?? "";

	// Only show hover-swap secondary image when no variant-specific image is active
	const secondaryMedia = !variantImage
		? product.media?.find((m) => m?.url && m.url !== product.thumbnail?.url)
		: null;

	return (
		<div className="relative aspect-square overflow-hidden">
			{/* Sale badge */}
			{isOnSale && (
				<div className="absolute top-2 left-2 z-10">
					<span className="bg-destructive text-destructive-foreground inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-md">
						SALE
					</span>
				</div>
			)}

			{/* Wishlist button */}
			<button
				aria-label="Wishlist"
				className="bg-card/80 hover:bg-card absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<Heart className="text-muted-foreground group-hover:text-badge-recommended h-4 w-4 transition-colors" />
			</button>

			{/* Primary image (product thumbnail or selected variant image) */}
			{primaryUrl ? (
				<ProductImageWrapper
					loading={loading}
					src={primaryUrl}
					alt={primaryAlt}
					width={512}
					height={512}
					sizes="512px"
					priority={priority}
					className={cn(
						"h-full w-full object-contain transition-all duration-500 ease-out",
						secondaryMedia?.url ? "group-hover:opacity-0" : "group-hover:scale-[1.06]"
					)}
				/>
			) : (
				<div className="text-muted-foreground flex h-full items-center justify-center">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-12 w-12">
						<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
					</svg>
				</div>
			)}

			{/* Secondary hover image (only when no variant image is active) */}
			{secondaryMedia?.url && (
				<ProductImageWrapper
					loading={loading}
					src={secondaryMedia.url}
					alt={secondaryMedia.alt ?? ""}
					width={512}
					height={512}
					sizes="512px"
					priority={false}
					className="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
				/>
			)}
		</div>
	);
};

export { ProductCardImage };
