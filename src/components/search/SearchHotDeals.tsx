"use client";

import { Tag } from "lucide-react";
import { SwiperProduct } from "@components/swiper";
import { LinkWithChannel } from "@components/navigation";
import { type ProductFragment } from "@/gql/graphql";


type SearchHotDealsProps = {
	products: ProductFragment[];
};

const SearchHotDeals = ({ products }: SearchHotDealsProps) => {
	if (!products || products.length === 0) return null;

	// Filter products that are on sale
	const dealsProducts = products.filter((p) => p.pricing?.onSale).slice(0, 12);

	if (dealsProducts.length === 0) return null;

	return (
		<section className="py-12">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
							<Tag className="h-6 w-6 text-red-600" />
						</div>
						<div>
							<h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Hot Deals</h2>
							<p className="mt-1 text-sm text-gray-600">Limited time offers - Save up to 50%</p>
						</div>
					</div>
					<LinkWithChannel
						href="/collections/sale"
						className="hidden text-sm font-semibold text-gray-900 transition-colors hover:text-gray-700 sm:block"
					>
						View all →
					</LinkWithChannel>
				</div>
			</div>
			<SwiperProduct products={dealsProducts} />
		</section>
	);
};

export { SearchHotDeals };
