"use client";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { LinkWithChannel } from "@components/navigation";
import { Button } from "@components/ui";
import { heroCampaigns } from "../data/searchData";
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
							className="relative min-h-[320px] overflow-hidden p-10 sm:min-h-[400px] md:p-16"
							style={{
								background: `linear-gradient(135deg, var(--hero-${item.colorScheme}-from), var(--hero-${item.colorScheme}-to))`
							}}
						>
							<div className="absolute inset-0 bg-black/10" />

							{/* Parallelogram decorations — skewed shapes, top-left rounded */}
							<div
								className="absolute top-[-60px] right-[8%] h-[340px] w-[220px] rounded-tl-[3rem] opacity-20"
								style={{
									transform: "skewX(-14deg)",
									background: "rgba(255,255,255,0.25)",
									filter: "blur(0px)"
								}}
							/>
							<div
								className="absolute top-[-30px] right-[18%] h-[280px] w-[140px] rounded-tl-[2.5rem] opacity-15"
								style={{
									transform: "skewX(-14deg)",
									background: "rgba(255,255,255,0.18)"
								}}
							/>
							<div
								className="absolute right-[4%] bottom-[-40px] h-[200px] w-[160px] rounded-tl-[2rem] opacity-10"
								style={{
									transform: "skewX(-14deg)",
									background: "rgba(255,255,255,0.3)"
								}}
							/>
							<div className="relative z-10 flex h-full max-w-2xl flex-col justify-center">
								<div>
									<p className="text-hero-text-muted mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
										{item.tag}
									</p>
									<h2 className="text-hero-text text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl">
										{item.title}
									</h2>
									<p className="text-hero-text-muted mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
										{item.subtitle}
									</p>
								</div>
								<div className="mt-8 flex items-center gap-4">
									<LinkWithChannel href={item.href}>
										<Button className="bg-hero-btn-bg text-hero-btn-text hover:bg-hero-btn-bg/90 rounded-lg px-8 py-3 text-base font-semibold shadow-lg transition-all hover:scale-105">
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
