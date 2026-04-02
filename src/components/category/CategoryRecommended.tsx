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
			<div className="mb-8 flex items-center gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-badge-recommended-muted">
				<Heart className="animate-icon-heartbeat h-6 w-6 text-badge-recommended" />
				</div>
				<div>
					<h2 className="text-2xl font-semibold tracking-tight text-foreground">Recommended for You</h2>
					<p className="mt-1 text-sm text-muted-foreground">Based on your browsing history</p>
				</div>
			</div>
			<SwiperProduct products={recommended} />
		</section>
	);
};

export { CategoryRecommended };
