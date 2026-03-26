"use client";

import { TrendingUp, Star, Flame } from "lucide-react";
import { SwiperProduct } from "@components/swiper";
import { type ProductFragment } from "@/gql/graphql";

type CategoryFeaturedProductsProps = {
	products: ProductFragment[];
};

const CategoryFeaturedProducts = ({ products }: CategoryFeaturedProductsProps) => {
	if (!products || products.length === 0) return null;

	const bestSellers = products.filter((p) => Number(p.rating) >= 4).slice(0, 8);
	const trending = products.slice(0, 8);
	const hotItems = products.filter((p) => p.pricing?.onSale).slice(0, 8);

	return (
		<div className="space-y-12">
			{/* Best Sellers */}
			{bestSellers.length > 0 && (
				<section>
					<div className="mb-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
							<Star className="h-6 w-6 text-yellow-600" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-gray-900">Best Sellers</h2>
							<p className="mt-1 text-sm text-gray-600">Top rated products in this category</p>
						</div>
					</div>
					<SwiperProduct products={bestSellers} />
				</section>
			)}

			{/* Trending Products */}
			{trending.length > 0 && (
				<section>
					<div className="mb-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
							<TrendingUp className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-gray-900">Trending Now</h2>
							<p className="mt-1 text-sm text-gray-600">Popular items this week</p>
						</div>
					</div>
					<SwiperProduct products={trending} />
				</section>
			)}

			{/* Hot Items */}
			{hotItems.length > 0 && (
				<section>
					<div className="mb-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
							<Flame className="h-6 w-6 text-red-600" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-gray-900">Hot Deals</h2>
							<p className="mt-1 text-sm text-gray-600">Special offers and discounts</p>
						</div>
					</div>
					<SwiperProduct products={hotItems} />
				</section>
			)}
		</div>
	);
};

export { CategoryFeaturedProducts };
