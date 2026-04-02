"use client";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@components/navigation";
import { Button } from "@components/ui";
import { heroCampaigns } from "./searchData";
import "@assets/styles/_swiper.scss";

const SearchHero = () => {
	return (
		<section className="mb-8 overflow-hidden rounded-xl shadow-lg">
			<Swiper
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				navigation
				pagination={{ clickable: true }}
				modules={[Autoplay, Navigation, Pagination]}
				className="[&_.swiper-pagination-bullet]:bg-hero-text/60 [&_.swiper-pagination-bullet-active]:bg-hero-text"
			>
				{heroCampaigns.map((item) => (
					<SwiperSlide key={item.id}>
						<div
							className={cn(
								"relative min-h-[320px] overflow-hidden bg-linear-to-br p-10 sm:min-h-[400px] md:p-16",
								item.theme
							)}
						>
							<div className="absolute inset-0 opacity-10" />
							<div className="relative z-10 flex h-full max-w-2xl flex-col justify-center">
								<div>
									<p className="mb-4 text-xs font-semibold tracking-[0.3em] text-hero-text-muted uppercase">
										{item.tag}
									</p>
									<h2
										className={cn(
											"text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl",
											item.accent
										)}
									>
										{item.title}
									</h2>
									<p className="mt-4 max-w-xl text-base leading-relaxed text-hero-text-muted sm:text-lg">
										{item.subtitle}
									</p>
								</div>
								<div className="mt-8 flex items-center gap-4">
									<LinkWithChannel href={item.href}>
										<Button className="rounded-lg bg-hero-btn-bg px-8 py-3 text-base font-semibold text-hero-btn-text shadow-lg transition-all hover:scale-105 hover:bg-hero-btn-bg/90">
											{item.cta}
										</Button>
									</LinkWithChannel>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export { SearchHero };
