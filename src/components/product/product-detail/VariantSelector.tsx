"use client";

import { VariantElement } from "./VariantElement";
import { type ProductDetailsQuery, type VariantDetailsFragment } from "@/gql/graphql";
import { type ProductItem } from "@/types";

export function VariantSelector({
	variants,
	product,
	channel
}: {
	variants: NonNullable<ProductDetailsQuery["product"]>["variants"];
	product: ProductItem;
	selectedVariant?: VariantDetailsFragment;
	channel: string;
}) {
	return (
		<>
			{Number(variants?.length) > 1 && (
				<VariantElement variants={variants} slug={product?.slug || ""} channel={channel} />
			)}
		</>
	);
}
