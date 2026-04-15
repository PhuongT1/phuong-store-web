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
			<div className="border-border bg-card rounded-xl border p-3 shadow-sm sm:p-6">
				<div className="mb-3 flex items-start justify-between sm:mb-5 sm:items-center">
					<div>
						<p className="text-muted-foreground mb-0.5 text-[11px] font-medium tracking-wider uppercase sm:mb-1 sm:text-xs">
							Recently viewed
						</p>
						<h3 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">Continue Shopping</h3>
					</div>
					<Button
						variant="ghost"
						className="text-muted-foreground hover:text-foreground rounded-lg px-1.5 py-1 text-[12px] sm:px-2 sm:text-sm font-medium"
						onClick={clearAll}
					>
						Clear history
					</Button>
				</div>
				<SwiperSlider
					spaceBetween={10}
					slidesPerView={1.45}
					className="-my-1 overflow-visible py-1 sm:-my-2 sm:py-2"
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
										<div className="border-border bg-card ring-border/70 flex h-full flex-col overflow-hidden rounded-xl border ring-1 ring-inset shadow-sm transition-all duration-200 sm:hover:-translate-y-1 sm:hover:shadow-md">
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
											<div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3">
												<p className="text-foreground line-clamp-2 text-[13px] leading-snug font-semibold sm:text-sm">
													{item.name}
												</p>
												<div className="mt-auto flex items-baseline gap-2 pt-2">
													<span className="text-foreground text-[15px] font-bold sm:text-base">{item.price}</span>
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
