"use client";

import { LinkWithChannel } from "@components/navigation";
import { Button } from "@components/ui";
import { ProductElement } from "@components/product";
import { cn } from "@/lib/utils";
import { useRecentlyViewedProducts } from "@/lib/hooks/useRecentlyViewedProducts";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { type ProductListProps } from "@/types";

const SearchRecentlyViewed = ({ products }: ProductListProps) => {
	const { items, clearAll } = useRecentlyViewedProducts();

	const hasStoredItems = items.length > 0;
	const fallbackProducts = products?.slice(0, 6) ?? [];

	if (!hasStoredItems && fallbackProducts.length === 0) return null;

	return (
		<section>
			<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<p className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">Recently viewed</p>
						<h3 className="text-2xl font-semibold tracking-tight text-gray-900">Continue Shopping</h3>
					</div>
					<Button
						variant="ghost"
						className="rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900"
						onClick={clearAll}
					>
						Clear history
					</Button>
				</div>
				<div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4">
					{hasStoredItems
						? items.map((item) => (
								<LinkWithChannel key={item.id} href={`/products/${item.slug}`} className="min-w-[220px]">
									<div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-md">
										<div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
											{item.imageUrl ? (
												<ProductImageWrapper
													alt={item.imageAlt ?? item.name}
													src={item.imageUrl}
													width={360}
													height={450}
													sizes="360px"
													className="h-full w-full object-cover"
													loading="lazy"
												/>
											) : (
												<div className="flex h-full items-center justify-center text-xs text-gray-400">
													No image
												</div>
											)}
										</div>
										<div className="flex-1 p-4">
											<p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>
											<div className="mt-2 flex items-baseline gap-2">
												<span className="text-base font-semibold text-gray-900">{item.price}</span>
												{item.onSale && (
													<span className="text-xs text-gray-500 line-through">{item.priceUndiscounted}</span>
												)}
											</div>
										</div>
									</div>
								</LinkWithChannel>
							))
						: fallbackProducts.map((product, index) => (
								<ProductElement
									key={product?.id ?? index}
									product={product}
									priority={index < 2}
									loading={index < 3 ? "eager" : "lazy"}
									className="min-w-[220px]"
								/>
							))}
				</div>
			</div>
		</section>
	);
};

export { SearchRecentlyViewed };
