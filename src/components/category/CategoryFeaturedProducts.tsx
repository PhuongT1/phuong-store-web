"use client";

import { TrendingUp, Star, Flame } from "lucide-react";
import { type ProductFragment } from "@/gql/graphql";
import { SwiperProduct } from "@components/swiper";

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
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-badge-best-muted">
					<Star className="animate-icon-star h-6 w-6 text-badge-best" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-foreground">Best Sellers</h2>
							<p className="mt-1 text-sm text-muted-foreground">Top rated products in this category</p>
						</div>
					</div>
					<SwiperProduct products={bestSellers} />
				</section>
			)}

			{/* Trending Products */}
			{trending.length > 0 && (
				<section>
					<div className="mb-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-badge-trending-muted">
					<TrendingUp className="animate-icon-bounce h-6 w-6 text-badge-trending" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-foreground">Trending Now</h2>
							<p className="mt-1 text-sm text-muted-foreground">Popular items this week</p>
						</div>
					</div>
					<SwiperProduct products={trending} />
				</section>
			)}

			{/* Hot Items */}
			{hotItems.length > 0 && (
				<section>
					<div className="mb-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-badge-hot-muted">
					<Flame className="animate-icon-flame h-6 w-6 text-badge-hot" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-foreground">Hot Deals</h2>
							<p className="mt-1 text-sm text-muted-foreground">Special offers and discounts</p>
						</div>
					</div>
					<SwiperProduct products={hotItems} />
				</section>
			)}
		</div>
	);
};

export { CategoryFeaturedProducts };
