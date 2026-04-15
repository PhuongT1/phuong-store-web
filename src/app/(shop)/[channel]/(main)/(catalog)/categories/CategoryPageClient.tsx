"use client";

import { CategoryFeaturedProducts, CategoryRecommended, CategoryDescription } from "@/components/category";
import { SearchRecentlyViewed } from "@/components/search";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { type Pages } from "@/types";
import { ProductListLayout } from "@components/layouts";
import { ProductListLoadMore, ProductSortBar } from "@components/product";
import { useProductListByCategoryInfinite } from "@hooks/useProductListByCategory";

type CategoryPageClientProps = {
	products: ProductListByCategoryPaginatedQuery;
} & Pages;

const CategoryPageClient = ({ products: initialData, channel, slug }: CategoryPageClientProps) => {
	const { products, category, ...rest } = useProductListByCategoryInfinite({
		channel,
		initialData,
		slug
	});

	const totalCount = rest.remainingCount + products.length;

	return (
		<>
			{/* Main Product Browsing Area - With filter layout */}
			<ProductListLayout>
				{/* Sorting Bar with Result Count */}
				<ProductSortBar resultCount={totalCount} />

				{/* Product Grid */}
				<ProductListLoadMore productListProps={{ products: products }} SWRResponse={rest} />
			</ProductListLayout>

			{/* Discovery Sections - Outside filter layout, truly full width */}
			<div className="space-y-0">
				{/* Trending Products (Best Sellers, Hot Deals) */}
				<div>
					<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
						<CategoryFeaturedProducts products={products} />
					</div>
				</div>

				{/* Recommended Products */}
				<div>
					<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
						<CategoryRecommended products={products} />
					</div>
				</div>

				{/* Recently Viewed Products */}
				<div>
					<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
						<SearchRecentlyViewed products={products} />
					</div>
				</div>

				{/* Category SEO Description */}
				<CategoryDescription category={category} />
			</div>
		</>
	);
};

export { CategoryPageClient };
