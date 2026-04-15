"use client";

import { Heart } from "lucide-react";
import { type ProductFragment } from "@/gql/graphql";
import { SwiperProduct } from "@components/swiper";

type CategoryRecommendedProps = {
	products: ProductFragment[];
};

const CategoryRecommended = ({ products }: CategoryRecommendedProps) => {
	if (!products || products.length === 0) return null;

	const recommended = products.slice(0, 8);

	return (
		<section>
			<div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
				<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-badge-recommended-muted sm:h-12 sm:w-12">
				<Heart className="animate-icon-heartbeat h-6 w-6 text-badge-recommended" />
				</div>
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Recommended for You</h2>
					<p className="mt-1 text-[13px] text-muted-foreground sm:text-sm">Based on your browsing history</p>
				</div>
			</div>
			<SwiperProduct products={recommended} />
		</section>
	);
};

export { CategoryRecommended };
