"use client";

import { ProductListLoadMore } from "@components/product";
import { type ProductListPaginatedQuery } from "@/gql/graphql";
import { type Pages } from "@/types";
import { useProductListByCollectionInfinite } from "@/hooks/useProductListByCollection";

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
