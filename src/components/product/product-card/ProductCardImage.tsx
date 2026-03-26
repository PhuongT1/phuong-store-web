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
		<div className="relative aspect-square overflow-hidden bg-[#f5f6f7]">
			{/* Sale badge */}
			{isOnSale && (
				<div className="absolute top-2 left-2 z-10">
					<span className="inline-flex items-center rounded-md bg-red-500 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase shadow">
						SALE
					</span>
				</div>
			)}

			{/* Wishlist button */}
			<button
				aria-label="Yêu thích"
				className="absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<Heart className="h-4 w-4 text-gray-400 transition-colors group-hover:text-rose-400" />
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
				<div className="flex h-full items-center justify-center text-gray-300">
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
