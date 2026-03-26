"use client";

import { SwiperSlide } from "swiper/react";
import { SwiperSlider } from "@components/swiper";
import { LinkWithChannel } from "@components/navigation";
import { Button } from "@components/ui";
import { whatsHotItems } from "./searchData";
import { cn } from "@/lib/utils";

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
					<SwiperSlide key={item.id} className="!h-full">
						<div
							className={cn(
								"border-border flex h-full flex-col justify-between rounded-none border bg-gradient-to-br p-6",
								item.bg
							)}
						>
							<div>
								<p className="text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">Featured</p>
								<h4 className={cn("mt-3 text-xl font-semibold", item.accent)}>{item.name}</h4>
								<p className="mt-2 text-sm text-white/80">{item.tagline}</p>
							</div>
							<LinkWithChannel href={item.href}>
								<Button className="mt-6 w-fit rounded-none bg-white px-4 text-sm font-semibold text-black hover:bg-neutral-100">
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
