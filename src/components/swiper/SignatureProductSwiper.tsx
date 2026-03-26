"use client";

import { SwiperSlide } from "swiper/react";
import { LinkWithChannel } from "@components/navigation";
import { RenderRichText } from "../product";
import { SwiperSlider } from "./SwiperSlider";
import { type ProductListProps, type ProductItem } from "@/types";

const SignatureProductSwiper = ({ products }: ProductListProps) => {
	if (!products || products.length === 0) return <></>;

	const handleSwiperSlide = (product: ProductItem) => {
		const attributeHasBanner = product?.attributes.find(
			(attribute) => attribute.attribute.slug === "banner-cua-san-pham-noi-bat"
		);

		if (!attributeHasBanner) return null;

		const renderBanner = attributeHasBanner?.values.map((value, index) => (
			<RenderRichText key={index} item={value.richText} />
		));

		return (
			<SwiperSlide key={product?.id}>
				<LinkWithChannel
					href={`/products/${product?.slug}`}
					key={product?.id}
					className="block h-full w-full overflow-hidden rounded-[20px] [&_.rich-text]:h-full [&_img]:h-full [&_img]:w-full"
				>
					{renderBanner}
				</LinkWithChannel>
			</SwiperSlide>
		);
	};

	return (
		<SwiperSlider
			spaceBetween={10}
			slidesPerView={1}
			breakpoints={{
				768: {
					slidesPerView: products.length === 1 ? 1 : 2
				}
			}}
			className="h-[180px]"
			autoHeight={false}
			pagination={{
				dynamicBullets: true
			}}
		>
			{products?.map((product) => handleSwiperSlide(product))}
		</SwiperSlider>
	);
};

export { SignatureProductSwiper };
