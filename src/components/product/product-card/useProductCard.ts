"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { formatMoney, getProductPrice } from "@/lib/utils";
import { addToCart } from "@/services/cart.service";
import { notify } from "@components/ui";

type Product = NonNullable<ProductDetailsQuery["product"]>;

/** Format a raw sold-count number into a compact Vietnamese display string.
 *  e.g. 13900 → "13,9k"  |  450 → "450"  |  1500000 → "1,5tr" */
function formatSoldCount(n: number): string {
	if (!Number.isFinite(n) || n < 0) return "";
	if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}tr`.replace(".", ",");
	if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}k`.replace(".", ",");
	return String(n);
}

const useProductCard = (product: Product) => {
	const t = useTranslations("product");
	const router = useRouter();
	const variants = product.variants ?? [];
	const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? "");
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const params = useParams<{ channel?: string }>();
	const channel = params?.channel;

	const { price, discounted, priceUndiscounted, pricing, selectedVariant } = getProductPrice({
		product,
		selectedVariantID: selectedVariantId,
		isProductElement: true
	});

	const activeVariant = selectedVariant ?? variants[0];

	// When a variant has its own media, show it; otherwise fall back to product thumbnail
	const variantImage = activeVariant?.media?.[0]
		? { url: activeVariant.media[0].url, alt: activeVariant.media[0].alt }
		: null;

	const isInStock = (activeVariant?.quantityAvailable ?? 0) > 0;
	const isOnSale = activeVariant?.pricing?.onSale ?? pricing?.onSale ?? false;

	const savingsAmount = activeVariant?.pricing?.discount?.gross?.amount ?? 0;
	const savingsCurrency = activeVariant?.pricing?.discount?.gross?.currency;
	const savingsFormatted =
		savingsAmount > 0 && savingsCurrency ? formatMoney(savingsAmount, savingsCurrency) : null;

	const soldCountRaw = product.attributes?.find((attr) => attr.attribute.slug === "sold")?.values[0]?.name;
	const soldCount = soldCountRaw ? formatSoldCount(Number(soldCountRaw)) : null;

	// Round to 1 decimal — hide when 0 or null
	const ratingValue =
		product.rating != null && product.rating > 0 ? Math.round(product.rating * 10) / 10 : null;

	// Spec chips: skip "sold" attribute, max 3
	const specChips = (
		product.attributes
			?.filter((attr) => attr.attribute.slug !== "sold")
			.flatMap((attr) => attr.values.map((v) => v?.name).filter(Boolean)) ?? []
	).slice(0, 3);

	const handleVariantSelect = (e: React.MouseEvent, variantId: string) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedVariantId(variantId);
	};

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const variantId = activeVariant?.id;
		if (!channel || !variantId) return;
		setIsAddingToCart(true);
		try {
			await addToCart({ channel, lines: [{ variantId, quantity: 1 }] });
			notify.success(t("addedToCart"));
			router.refresh();
		} catch (error) {
			console.error("Error adding to cart:", error);
			notify.error(t("addToCartError"));
		} finally {
			setIsAddingToCart(false);
		}
	};

	return {
		variants,
		selectedVariantId,
		isAddingToCart,
		variantImage,
		price,
		discounted,
		priceUndiscounted,
		activeVariant,
		isInStock,
		isOnSale,
		savingsFormatted,
		soldCount,
		ratingValue,
		specChips,
		handleVariantSelect,
		handleAddToCart
	};
};

export { useProductCard, formatSoldCount };
