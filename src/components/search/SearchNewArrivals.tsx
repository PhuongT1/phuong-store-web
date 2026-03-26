"use client";

import { Sparkles } from "lucide-react";
import { SwiperProduct } from "@components/swiper";
import { LinkWithChannel } from "@components/navigation";
import { type ProductFragment } from "@/gql/graphql";

type SearchNewArrivalsProps = {
	products: ProductFragment[];
};

const SearchNewArrivals = ({ products }: SearchNewArrivalsProps) => {
	if (!products || products.length === 0) return null;

	const newArrivals = products.slice(0, 12);

	return (
		<section className="py-12">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
							<Sparkles className="h-6 w-6 text-purple-600" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
								New Arrivals
							</h2>
							<p className="mt-1 text-sm text-gray-600">Fresh products just added</p>
						</div>
					</div>
					<LinkWithChannel
						href="/collections/new-arrivals"
						className="hidden text-sm font-semibold text-gray-900 transition-colors hover:text-gray-700 sm:block"
					>
						View all →
					</LinkWithChannel>
				</div>
			</div>
			<SwiperProduct products={newArrivals} />
		</section>
	);
};

export { SearchNewArrivals };
