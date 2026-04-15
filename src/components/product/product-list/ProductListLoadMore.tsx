"use client";

import { useEffect, useState } from "react";
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

		/**
		 * Immediately show skeleton when URL params change (filter / sort).
		 * We can't use isValidating directly because SWR fires it one render
		 * cycle AFTER React has already committed the URL change, causing a
		 * visible flash of stale content before the skeleton kicks in.
		 *
		 * Strategy: store a "params fingerprint" in state. When it diverges
		 * from the current searchParams, we're already in the render that saw
		 * the new URL → show skeleton immediately, before SWR fires.
		 */
		const [prevParams, setPrevParams] = useState(() => searchParams?.toString() ?? "");
		const currentParams = searchParams?.toString() ?? "";
		const paramsJustChanged = prevParams !== currentParams;

		// Sync stored params once we're sure SWR has seen the change too
		useEffect(() => {
			if (paramsJustChanged) {
				setPrevParams(currentParams);
			}
		}, [currentParams, paramsJustChanged]);

		/**
		 * Show skeleton when:
		 * 1. isLoading — first-ever fetch (nothing in SWR cache)
		 * 2. paramsJustChanged — URL already updated but SWR hasn't resolved yet
		 * 3. isValidating && size === 1 — SWR is re-fetching page 1 after params change
		 *    (belt-and-suspenders: covers the render after useEffect fires)
		 */
		const showSkeleton = isLoading || paramsJustChanged || (isValidating && size === 1);

		return (
			<>
				<ProductList isLoading={showSkeleton} products={products} viewMode={viewMode} />
				{!showSkeleton && hasNextPage && (
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
