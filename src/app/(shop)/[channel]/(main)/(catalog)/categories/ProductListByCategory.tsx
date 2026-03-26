"use client";

import { useProductListByCategoryInfinite } from "@hooks/useProductListByCategory";
import { ProductListLoadMore, ProductSort } from "@components/product";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { type Pages } from "@/types";
import { CategoryFeaturedProducts, CategoryRecommended, CategoryDescription } from "@/components/category";
import { SearchRecentlyViewed } from "@/components/search";

type ProductListLoadMoreProps = { products: ProductListByCategoryPaginatedQuery } & Pages;

const ProductListByCategory = ({ products: initialData, channel, slug }: ProductListLoadMoreProps) => {
	const { products, category, ...rest } = useProductListByCategoryInfinite({
		channel,
		initialData,
		slug
	});

	const totalCount = rest.remainingCount + products.length;

	return (
		<>
			{/* Sorting Bar with Result Count */}
			<ProductSort resultCount={totalCount} />

			{/* Main Product Grid - Inside filter/grid layout */}
			<div className="mb-12">
				<ProductListLoadMore productListProps={{ products: products }} SWRResponse={rest} />
			</div>

			{/* Featured Sections - Full Width Below Grid */}
			<div className="-mx-4 sm:-mx-6 lg:-mx-8">
				{/* Best Sellers, Trending, Hot Deals */}
				<div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
					<CategoryFeaturedProducts products={products} />
				</div>

				{/* Recommended Products */}
				<div className="px-4 py-12 sm:px-6 lg:px-8">
					<CategoryRecommended products={products} />
				</div>

				{/* Recently Viewed Products */}
				<div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
					<SearchRecentlyViewed products={products} />
				</div>

				{/* Category Description (SEO) */}
				<CategoryDescription category={category} />
			</div>
		</>
	);
};
export { ProductListByCategory };
