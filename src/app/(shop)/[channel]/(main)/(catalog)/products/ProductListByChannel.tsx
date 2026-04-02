"use client";

import { ProductListLayout } from "@/components/layouts";
import { SearchResultsHeader, ProductSortBar } from "@/components/search";
import { type ProductListPaginatedQuery } from "@/gql/graphql";
import { useAddQueryParams } from "@/lib/hooks";
import { type Channel } from "@/types";
import { ProductListLoadMore } from "@components/product";
import { useProductListInfinite } from "@hooks/useProductList";

type ProductListLoadMoreProps = { products: ProductListPaginatedQuery } & Channel;

const ProductListByChannel = ({ products: initialData, channel }: ProductListLoadMoreProps) => {
	void initialData; // SSR fallback handled by SWR fallback in page.tsx
	const { products, ...rest } = useProductListInfinite({ channel });
	const { getParam } = useAddQueryParams();
	const searchContent = getParam("filter_search") ?? undefined;

	const header = (
		<SearchResultsHeader
			searchQuery={searchContent}
			totalResults={rest.remainingCount + products.length}
			isLoading={rest.isLoading}
		/>
	);

	return (
		<ProductListLayout title={header}>
			<ProductSortBar />
			<ProductListLoadMore productListProps={{ products: products }} SWRResponse={rest} />
		</ProductListLayout>
	);
};
export { ProductListByChannel };

