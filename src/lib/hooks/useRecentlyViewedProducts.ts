"use client";

import { useCallback, useEffect, useState } from "react";
import { getProductPrice } from "@/lib/utils";
import { type Product } from "@/gql/graphql";

const STORAGE_KEY = "recentlyViewedProducts";
const MAX_ITEMS = 12;

export type RecentlyViewedItem = {
	id: string;
	slug: string;
	name: string;
	imageUrl?: string;
	imageAlt?: string;
	price?: string;
	priceUndiscounted?: string;
	discounted?: string;
	onSale?: boolean | null;
};

const readFromStorage = () => {
	if (typeof window === "undefined") return [] as RecentlyViewedItem[];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [] as RecentlyViewedItem[];
		return JSON.parse(raw) as RecentlyViewedItem[];
	} catch {
		return [] as RecentlyViewedItem[];
	}
};

const writeToStorage = (items: RecentlyViewedItem[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const mapProductToRecent = (product: Product): RecentlyViewedItem => {
	const { price, discounted, priceUndiscounted, pricing } = getProductPrice({
		product,
		isProductElement: true
	});

	return {
		id: product.id,
		slug: product.slug,
		name: product.name,
		imageUrl: product.thumbnail?.url ?? undefined,
		imageAlt: product.thumbnail?.alt || product.name,
		price: price ?? undefined,
		priceUndiscounted: priceUndiscounted ?? undefined,
		discounted: discounted ?? undefined,
		onSale: pricing?.onSale
	};
};

const addRecentlyViewedProduct = (product: Product) => {
	if (!product?.id) return;
	const current = readFromStorage();
	const mapped = mapProductToRecent(product);
	const next = [mapped, ...current.filter((item) => item.id !== mapped.id)].slice(0, MAX_ITEMS);
	writeToStorage(next);
};

const useRecentlyViewedProducts = () => {
	const [items, setItems] = useState<RecentlyViewedItem[]>([]);

	useEffect(() => {
		setItems(readFromStorage());
	}, []);

	const clearAll = useCallback(() => {
		writeToStorage([]);
		setItems([]);
	}, []);

	const refresh = useCallback(() => {
		setItems(readFromStorage());
	}, []);

	return { items, clearAll, refresh };
};

export { useRecentlyViewedProducts, addRecentlyViewedProduct };
