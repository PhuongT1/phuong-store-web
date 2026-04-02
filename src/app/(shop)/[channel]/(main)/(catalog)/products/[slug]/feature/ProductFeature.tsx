"use client";

import { MainProductLayout } from "@/components/layouts";
import { type ProductItem } from "@/lib/utils";
import { type Pages, type Attributes } from "@/types";
import { ProductContext } from "@components/product";
import { ProductRating } from "./rating/ProductRating";
import { RelatedPage } from "./RelatedPage";
import { RelatedProduct } from "./RelatedProduct";

type ProductFeatureProps = { params: Pages } & Attributes & ProductItem;

const ProductFeature = ({ params, attributes, product }: ProductFeatureProps) => {
	return (
		<ProductContext.Provider value={{ product }}>
			<MainProductLayout containerClassName="p-0 sm:p-3">
				<ProductRating params={params} />
			</MainProductLayout>
			<RelatedProduct channel={params.channel} attributes={attributes} />
			<RelatedPage attributes={attributes} />
		</ProductContext.Provider>
	);
};

export { ProductFeature, type ProductFeatureProps };
