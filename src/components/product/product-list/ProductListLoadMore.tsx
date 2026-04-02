"use client";

import { useSearchParams } from "next/navigation";
import { LoadMoreButton } from "@ui";
import { type InfiniteResponse, type ProductListProps } from "@/types";
import { ProductList } from "./ProductList";

type ProductListLoadMoreProps = {
	productListProps: ProductListProps;
} & InfiniteResponse;

const ProductListLoadMore = ({
	productListProps: { products },
	SWRResponse: { isLoading, isValidating, size, setSize, hasNextPage, remainingCount }
}: ProductListLoadMoreProps) => {
	{
		const searchParams = useSearchParams();
		const viewMode = ((searchParams?.get("view")) ?? "grid") as "grid" | "list";
		const loadMore = () => setSize(size + 1);
		return (
			<>
				<ProductList isLoading={isLoading && !products?.length} products={products} viewMode={viewMode} />
				{hasNextPage && (
					<LoadMoreButton
						onClick={loadMore}
						remainingCount={remainingCount}
						disabled={isValidating || !hasNextPage}
						loading={isValidating}
					/>
				)}
			</>
		);
	}
};

export { ProductListLoadMore };
