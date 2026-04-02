"use client";

import React from "react";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { PRODUCTS_SLUG } from "@/constants";
import { type ProductItem } from "@/lib/utils";

type RatingLink = Pick<ProductItem, "product"> & { children: React.ReactNode; className?: string };

const RatingLink = ({ product, children, className }: RatingLink) => {
	return (
		<LinkWithChannel className={className} href={`/${PRODUCTS_SLUG}/${product?.slug}/rating`}>
			{children}
		</LinkWithChannel>
	);
};

export { RatingLink };
