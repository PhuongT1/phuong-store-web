"use client";

import { SwiperSlide } from "swiper/react";
import { useRecentlyViewedProducts } from "@/lib/hooks/useRecentlyViewedProducts";
import { type ProductListProps } from "@/types";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { LinkWithChannel } from "@components/navigation";
import { ProductElement } from "@components/product";
import { SwiperSlider } from "@components/swiper";
import { Button } from "@components/ui";

const SearchRecentlyViewed = ({ products }: ProductListProps) => {
	const { items, clearAll } = useRecentlyViewedProducts();

	const hasStoredItems = items.length > 0;
	const fallbackProducts = products?.slice(0, 8) ?? [];

	if (!hasStoredItems && fallbackProducts.length === 0) return null;

	return (
		<section>
			<div className="border-border bg-card rounded-xl border p-6 shadow-sm">
				<div className="mb-5 flex items-center justify-between">
					<div>
						<p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
							Recently viewed
						</p>
						<h3 className="text-foreground text-2xl font-semibold tracking-tight">Continue Shopping</h3>
					</div>
					<Button
						variant="ghost"
						className="text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium"
						onClick={clearAll}
					>
						Clear history
					</Button>
				</div>
				<SwiperSlider
					spaceBetween={12}
					slidesPerView={1.3}
					className="-my-2 overflow-visible py-2"
					breakpoints={{
						640: { slidesPerView: 2.3 },
						768: { slidesPerView: 3 },
						992: { slidesPerView: 4 },
						1280: { slidesPerView: 5 }
					}}
				>
					{hasStoredItems
						? items.map((item) => (
								<SwiperSlide key={item.id}>
									<LinkWithChannel href={`/products/${item.slug}`} className="block h-full">
										<div className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
											<div className="bg-muted relative aspect-square overflow-hidden">
												{item.imageUrl ? (
													<ProductImageWrapper
														alt={item.imageAlt ?? item.name}
														src={item.imageUrl}
														width={360}
														height={360}
														sizes="360px"
														className="h-full w-full object-contain"
														loading="lazy"
													/>
												) : (
													<div className="text-muted-foreground flex h-full items-center justify-center text-xs">
														No image
													</div>
												)}
											</div>
											<div className="flex flex-1 flex-col gap-1 p-3">
												<p className="text-foreground line-clamp-2 text-sm leading-snug font-semibold">
													{item.name}
												</p>
												<div className="mt-auto flex items-baseline gap-2 pt-2">
													<span className="text-foreground text-base font-bold">{item.price}</span>
													{item.onSale && (
														<span className="text-muted-foreground text-xs line-through">
															{item.priceUndiscounted}
														</span>
													)}
												</div>
											</div>
										</div>
									</LinkWithChannel>
								</SwiperSlide>
							))
						: fallbackProducts.map((product, index) => (
								<SwiperSlide key={product?.id ?? index}>
									<ProductElement
										className="h-full"
										product={product}
										priority={index < 2}
										loading={index < 3 ? "eager" : "lazy"}
									/>
								</SwiperSlide>
							))}
				</SwiperSlider>
			</div>
		</section>
	);
};

export { SearchRecentlyViewed };
