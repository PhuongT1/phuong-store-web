"use client";

import { type ProductDetailsQuery, type VariantDetailsFragment } from "@/gql/graphql";
import { type ProductItem } from "@/types";
import { VariantElement } from "./VariantElement";

export function VariantSelector({
	variants,
	product,
	channel,
	selectedVariantID,
	onVariantChange
}: {
	variants: NonNullable<ProductDetailsQuery["product"]>["variants"];
	product: ProductItem;
	selectedVariant?: VariantDetailsFragment;
	channel: string;
	selectedVariantID?: string;
	onVariantChange?: (variantId: string) => void;
}) {
	return (
		<>
			{Number(variants?.length) > 1 && (
				<VariantElement
					variants={variants}
					slug={product?.slug || ""}
					channel={channel}
					selectedVariantID={selectedVariantID}
					onVariantChange={onVariantChange}
				/>
			)}
		</>
	);
}
