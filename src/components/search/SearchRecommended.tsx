"use client";

import { SwiperProduct } from "@components/swiper";
import { Heart } from "lucide-react";
import { type ProductFragment } from "@/gql/graphql";

type SearchRecommendedProps = {
	products: ProductFragment[];
};

const SearchRecommended = ({ products }: SearchRecommendedProps) => {
	if (!products || products.length === 0) return null;

	const recommended = products.slice(0, 12);

	return (
		<section className="py-12">
			<div className="mb-8 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100">
						<Heart className="h-6 w-6 text-pink-600" />
					</div>
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
							Recommended for You
						</h2>
						<p className="mt-1 text-sm text-gray-600">Picked just for you</p>
					</div>
				</div>
			</div>
			<SwiperProduct products={recommended} />
		</section>
	);
};

export { SearchRecommended };
