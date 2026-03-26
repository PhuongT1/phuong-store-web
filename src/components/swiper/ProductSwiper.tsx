"use client";

import { SwiperSlide } from "swiper/react";
import { ProductElement } from "@components/product";
import { SwiperSlider } from "./SwiperSlider";
import { type ProductListProps } from "@/types";

const SwiperProduct = ({ products }: ProductListProps) => {
	if (!products) return <></>;

	return (
		<SwiperSlider spaceBetween={10} slidesPerView={2}>
			{products?.map((product, index) => (
				<SwiperSlide key={product?.id} className="!h-full">
					<ProductElement
						className="h-full"
						product={product}
						priority={index < 2}
						loading={index < 3 ? "eager" : "lazy"}
					/>
				</SwiperSlide>
			))}
		</SwiperSlider>
	);
};

export { SwiperProduct };
