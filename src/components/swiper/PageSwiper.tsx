"use client";

import { SwiperSlide } from "swiper/react";
import { type PageListProps } from "@/types";
import { PageElement } from "@components/page";
import { SwiperSlider } from "./SwiperSlider";

const PageSwiper = ({ pages }: PageListProps) => {
	if (!pages) return <></>;

	return (
		<SwiperSlider spaceBetween={10} slidesPerView={2}>
			{pages.map((page, index) => (
				<SwiperSlide key={page?.id}>
					<PageElement page={page} priority={index < 2} loading={index < 3 ? "eager" : "lazy"} />
				</SwiperSlide>
			))}
		</SwiperSlider>
	);
};

export { PageSwiper };
