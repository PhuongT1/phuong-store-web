"use client";

import { SwiperProduct } from "@components/swiper";
import { Flame } from "lucide-react";
import { type ProductFragment } from "@/gql/graphql";

type SearchBestSellersProps = {
	products: ProductFragment[];
};

const SearchBestSellers = ({ products }: SearchBestSellersProps) => {
	if (!products || products.length === 0) return null;

	const bestSellers = products.slice(0, 12);

	return (
		<section className="py-12">
			<div className="mb-8 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
						<Flame className="h-6 w-6 text-orange-600" />
					</div>
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Best Sellers</h2>
						<p className="mt-1 text-sm text-gray-600">Most popular products this month</p>
					</div>
				</div>
			</div>
			<SwiperProduct products={bestSellers} />
		</section>
	);
};

export { SearchBestSellers };
