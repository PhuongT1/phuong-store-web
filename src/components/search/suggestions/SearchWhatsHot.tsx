"use client";

import { SwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@components/navigation";
import { SwiperSlider } from "@components/swiper";
import { Button } from "@components/ui";
import { whatsHotItems } from "../data/searchData";

const SearchWhatsHot = () => {
	return (
		<section className="mt-8">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">What's hot</p>
					<h3 className="text-foreground mt-2 text-2xl font-semibold">Trending campaigns</h3>
				</div>
			</div>
			<SwiperSlider spaceBetween={12} slidesPerView={1.1} className="[&_.swiper-slide]:h-auto">
				{whatsHotItems.map((item) => (
					<SwiperSlide key={item.id} className="h-full!">
						<div
							className={cn(
								"border-border flex h-full flex-col justify-between rounded-none border bg-linear-to-br p-6",
								item.bg
							)}
						>
							<div>
								<p className="text-xs font-semibold tracking-[0.3em] text-hero-text-dim uppercase">Featured</p>
								<h4 className={cn("mt-3 text-xl font-semibold", item.accent)}>{item.name}</h4>
								<p className="mt-2 text-sm text-hero-text-muted">{item.tagline}</p>
							</div>
							<LinkWithChannel href={item.href}>
								<Button className="mt-6 w-fit rounded-none bg-hero-btn-bg px-4 text-sm font-semibold text-hero-btn-text hover:bg-hero-btn-bg/90">
									{item.cta}
								</Button>
							</LinkWithChannel>
						</div>
					</SwiperSlide>
				))}
			</SwiperSlider>
		</section>
	);
};

export { SearchWhatsHot };
