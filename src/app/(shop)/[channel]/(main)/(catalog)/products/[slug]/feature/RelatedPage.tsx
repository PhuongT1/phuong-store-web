"use client";

import { PageSwiper } from "@components/swiper";
import { MainProductLayout } from "@components/layouts";
import { type Attributes } from "@/types";
import { useRelatedPage } from "@/hooks/useRelatedPage";

type RelatedProductProps = Attributes;

const RelatedPage = ({ attributes }: RelatedProductProps) => {
	const attributeRelated = attributes.find((attribute) => attribute.attribute.slug === "bai-viet-lien-quan");

	const { data } = useRelatedPage({
		first: 20,
		filter: {
			ids: attributeRelated?.values.map((item) => item.reference || "")
		}
	});

	if (!data) return <></>;

	return (
		<MainProductLayout containerClassName="p-0 sm:p-3">
			<div className="bg-white p-3 md:rounded-lg md:p-5">
				<h3 className="title">{attributeRelated?.attribute.name}</h3>
				<PageSwiper pages={data} />
			</div>
		</MainProductLayout>
	);
};

export { RelatedPage };
