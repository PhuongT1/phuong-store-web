"use client";

import { Swiper } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import React from "react";
import { type SwiperOptions } from "swiper/types";
import { cn } from "@/lib/utils";
import "@assets/styles/_swiper.scss";

type SwiperSliderProps = React.ComponentPropsWithoutRef<typeof Swiper> & {
	children: React.ReactNode;
};

const SwiperSlider = ({ children, className, ...restSlider }: SwiperSliderProps) => {
	const breakpointsDefault: SwiperOptions["breakpoints"] = {
		768: {
			slidesPerView: 3
		},
		992: {
			slidesPerView: 4
		},
		1024: {
			slidesPerView: 5
		}
	};

	return (
		<Swiper
			className={cn("max-w-full [&_.swiper-button-disabled]:hidden", className)}
			navigation
			loop={false}
			autoHeight
			watchSlidesProgress
			observeParents
			observer
			resizeObserver
			breakpoints={breakpointsDefault}
			modules={[FreeMode, Navigation, Pagination]}
			{...restSlider}
		>
			{children && children}
		</Swiper>
	);
};

export { SwiperSlider };
