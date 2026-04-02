"use client";

import { RELATED_PRODUCT_SLUG } from "@/constants";
import { useRelatedProduct } from "@/hooks/useRelatedProduct";
import { type Attributes, type Channel } from "@/types";
import { MainProductLayout } from "@components/layouts";
import { SwiperProduct } from "@components/swiper";

type RelatedProductProps = Channel & Attributes;

const RelatedProduct = ({ channel, attributes }: RelatedProductProps) => {
	const attributeRelated = attributes.find((attribute) => attribute.attribute.slug === RELATED_PRODUCT_SLUG);
	const ids = attributeRelated?.values.map((item) => item.reference || "");

	const { data } = useRelatedProduct({
		channel,
		filter: {
			ids
		}
	});

	if (!data) return <></>;

	return (
		<MainProductLayout>
			<div className="md:rounded-lg md:bg-card md:p-5">
				<h3 className="title">{attributeRelated?.attribute.name}</h3>
				<SwiperProduct products={data} />
			</div>
		</MainProductLayout>
	);
};

export { RelatedProduct, type RelatedProductProps };
