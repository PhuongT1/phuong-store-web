"use client";

import { useProductListInfinite } from "@hooks/useProductList";
import { ProductListLoadMore } from "@components/product";
import { type ProductListPaginatedQuery } from "@/gql/graphql";
import { type Channel } from "@/types";
import { useAddQueryParams } from "@/lib/hooks";
import { ProductListLayout } from "@/components/layouts";

type ProductListLoadMoreProps = { products: ProductListPaginatedQuery } & Channel;

const ProductListByChannel = ({ products: initialData, channel }: ProductListLoadMoreProps) => {
	const { products, ...rest } = useProductListInfinite({
		channel
	});
	const { getParam } = useAddQueryParams();

	const searchContent = getParam("filter_search");
	const getTitle = () => {
		return (
			<>
				{searchContent && (
					<h1 className="mx-auto py-4 text-base">
						Tìm thấy <span className="font-semibold">{rest.remainingCount + products.length}</span> kết quả
						với từ khoá
						<span className="font-semibold"> {searchContent}</span>
					</h1>
				)}
			</>
		);
	};

	return (
		<ProductListLayout title={getTitle()}>
			<ProductListLoadMore productListProps={{ products: products }} SWRResponse={rest} />
		</ProductListLayout>
	);
};
export { ProductListByChannel };
