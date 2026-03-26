import { notFound } from "next/navigation";
import { SWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { executeGraphQL } from "@lib/api/fetchGraphQL";
import { parseParams, resolvePageQuery } from "@lib/utils";
import { PRODUCTS_PER_PAGE } from "@constants/index";
import { CONFIG_SWR_KEYS } from "@config/keys";
import { ProductListByChannel } from "./ProductListByChannel";
import { type PageQueryProps } from "@/types";
import { ProductListPaginatedDocument, type ProductListPaginatedQueryVariables } from "@/gql/graphql";

const metadata = {
	title: "Sản phẩm siêu rẻ"
};

const Page = async (props: PageQueryProps) => {
	const { resolvedSearchParams, resolvedParams } = await resolvePageQuery(props);
	const variables: ProductListPaginatedQueryVariables = {
		after: null,
		channel: resolvedParams.channel,
		first: PRODUCTS_PER_PAGE,
		...parseParams(resolvedSearchParams)
	};

	const fetcher = executeGraphQL(ProductListPaginatedDocument, {
		variables
	});
	const ProductList = await fetcher;
	const { products } = ProductList;

	if (!products) {
		notFound();
	}

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize((index) => [CONFIG_SWR_KEYS.PRODUCT_SEARCH_LIST, variables, index])]: [
						ProductList
					],
					[unstable_serialize(() => [CONFIG_SWR_KEYS.PRODUCT_SEARCH_LIST, variables])]: [ProductList]
				}
			}}
		>
			<ProductListByChannel channel={resolvedParams.channel} />
		</SWRConfig>
	);
};

export { Page as default, metadata };
