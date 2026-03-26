"use client";

import { Heart } from "lucide-react";
import { SwiperProduct } from "@components/swiper";
import { type ProductFragment } from "@/gql/graphql";

type CategoryRecommendedProps = {
	products: ProductFragment[];
};

const CategoryRecommended = ({ products }: CategoryRecommendedProps) => {
	if (!products || products.length === 0) return null;

	const recommended = products.slice(0, 8);

	return (
		<section>
			<div className="mb-8 flex items-center gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100">
					<Heart className="h-6 w-6 text-pink-600" />
				</div>
				<div>
					<h2 className="text-2xl font-semibold tracking-tight text-gray-900">Recommended for You</h2>
					<p className="mt-1 text-sm text-gray-600">Based on your browsing history</p>
				</div>
			</div>
			<SwiperProduct products={recommended} />
		</section>
	);
};

export { CategoryRecommended };
