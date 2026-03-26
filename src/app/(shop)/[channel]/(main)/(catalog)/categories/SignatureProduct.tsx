"use client";

import { useSignatureProduct } from "@hooks/useProductListByCategory";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { type Pages } from "@/types";
import { SignatureProductSwiper } from "@/components/swiper";

type ProductListLoadMoreProps = { category: ProductListByCategoryPaginatedQuery } & Pages;

const SignatureProduct = ({ category: { category }, channel }: ProductListLoadMoreProps) => {
	const { products } = useSignatureProduct({
		slug: "spnb",
		channel,
		filter: {
			categories: [category?.id ?? ""]
		}
	});

	if (!products || products.length === 0) return;

	return <SignatureProductSwiper products={products} />;
};
export { SignatureProduct };
