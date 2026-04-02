"use client";

import React, { useState } from "react";
// Import Swiper React components
import { Square } from "lucide-react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import { ProductMediaType } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { type MediaItem, type Media } from "@/types";
import { ImageItem, type ImageItemProps } from "@components/ui";

type ProductImageCarouselProps = {
	className?: string;
} & Media;

type ElementMedia = {
	item: MediaItem;
	isThumb?: boolean;
};

type VideoEmbed = {
	thumbnail_url: string;
	html: string;
};

const ProductImageCarousel = ({ media }: ProductImageCarouselProps) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();

	if (!media || media.length === 0) return <></>;

	const getElement = ({ item, isThumb }: ElementMedia) => {
		const { type, alt, url } = item;
		const attribute = {
			width: isThumb ? 50 : 500,
			height: isThumb ? 50 : 390,
			alt: alt,
			src: url,
			priority: true
		} as ImageItemProps;

		switch (type) {
			case ProductMediaType.Image:
				return <ImageItem className="w-full rounded-md object-cover object-center" {...attribute} />;
				break;
			case ProductMediaType.Video:
				const videoData = JSON.parse(item.oembedData) as VideoEmbed;
				if (isThumb) {
					return (
						<ImageItem
							className="w-full rounded-md object-cover object-center"
							{...attribute}
							src={videoData?.thumbnail_url}
						/>
					);
				}

				return (
					<div
						dangerouslySetInnerHTML={{
							__html: videoData?.html.replace(
								/width="\d+" height="\d+"/, // Correct RegEx to match width and height
								'width="100%" height="100%"' // Make iframe responsive
							)
						}}
						className="relative contents h-[0px] w-full pt-[56.25%] [&_iframe]:absolute [&_iframe]:left-0 [&_iframe]:top-0"
					/>
				);
			default:
				return <></>;
		}
	};

	return (
		<>
			<Swiper
				loop={false}
				spaceBetween={10}
				navigation
				thumbs={{ swiper: thumbsSwiper }}
				modules={[FreeMode, Navigation, Thumbs]}
				className="h-[235px] sm:h-[370px]"
			>
				{media.map((item, index) => (
					<SwiperSlide key={index}>{getElement({ item })}</SwiperSlide>
				))}
			</Swiper>
			<Swiper
				onSwiper={setThumbsSwiper}
				loop={false}
				spaceBetween={10}
				slidesPerView={"auto"}
				freeMode
				watchSlidesProgress
				modules={[FreeMode, Navigation, Thumbs]}
				className="mt-3 [&_.swiper-slide-thumb-active]:rounded-[5px] [&_.swiper-slide-thumb-active]:border [&_.swiper-slide-thumb-active]:border-[1px] [&_.swiper-slide-thumb-active]:border-info
"
				centeredSlidesBounds
				centerInsufficientSlides
				centeredSlides
			>
				{media.map((item, index) => (
					<SwiperSlide key={index} className="!h-[50px] !w-[50px] p-2 text-center">
						<div className={cn("thumb inline-flex h-full items-center justify-center")}>
							{getElement({ item, isThumb: true })}
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};

export { ProductImageCarousel };
