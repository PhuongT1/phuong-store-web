"use client";

import { type ProductListPaginatedQuery } from "@/gql/graphql";
import { useProductListByCollectionInfinite } from "@/hooks/useProductListByCollection";
import { type Pages } from "@/types";
import { ProductListLoadMore } from "@components/product";

type ProductListLoadMoreProps = { products: ProductListPaginatedQuery } & Pages;

const ProductListByCollection = ({ products: initialData, channel, slug }: ProductListLoadMoreProps) => {
	const { products, ...rest } = useProductListByCollectionInfinite({
		channel,
		initialData,
		slug
	});

	return <ProductListLoadMore productListProps={{ products: products }} SWRResponse={rest} />;
};
export { ProductListByCollection };
