"use client";

import { ProductListLayout } from "@/components/layouts";
import { SearchEmptyState, SearchResultsHeader, ProductSortBar } from "@/components/search";
import { type Channel } from "@/types";
import { ProductListLoadMore } from "@components/product";
import { useProductListInfinite } from "@hooks/useProductList";
import { useAddQueryParams } from "@lib/hooks";

const ProductListByChannel = ({ channel }: Channel) => {
	const { products, ...rest } = useProductListInfinite({ channel });
	const { getParam } = useAddQueryParams();

	const searchQuery = getParam("filter_search") ?? "";
	const totalResults = rest.remainingCount + products.length;

	const header = (
		<SearchResultsHeader searchQuery={searchQuery} totalResults={totalResults} isLoading={rest.isLoading} />
	);

	return (
		<ProductListLayout title={header}>
			<ProductSortBar />
			{products.length === 0 && !rest.isLoading && <SearchEmptyState searchQuery={searchQuery} />}
			<ProductListLoadMore productListProps={{ products }} SWRResponse={rest} />
		</ProductListLayout>
	);
};

export { ProductListByChannel };
