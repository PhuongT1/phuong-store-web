import { type SWRInfiniteResponse } from "swr/infinite";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { type PageQueryProps, type Pages } from "./page.type";

type ProductItem = ProductDetailsQuery["product"];
type Media = Pick<NonNullable<ProductItem>, "media">;
type Attributes = Pick<NonNullable<ProductItem>, "attributes">;
type MediaItem = NonNullable<Media["media"]>[number];
type ProductListProps = { products: ProductItem[]; className?: string; isLoading?: boolean; viewMode?: "grid" | "list" };
type InfiniteResponse = {
	SWRResponse: Omit<SWRInfiniteResponse, "data"> & {
		hasNextPage: boolean;
		remainingCount: number;
	};
};
type SearchProductsPage = { variant?: string };
type ProductPageQueryProps = PageQueryProps<Pages, SearchProductsPage>;

export {
	type Media,
	type MediaItem,
	type ProductListProps,
	type Attributes,
	type ProductItem,
	type InfiniteResponse,
	type SearchProductsPage,
	type ProductPageQueryProps
};
