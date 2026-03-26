"use client";

import { useProductListByCategoryInfinite } from "@hooks/useProductListByCategory";
import { ProductListLayout } from "@components/layouts";
import { ProductListLoadMore, ProductSort } from "@components/product";
import { type Pages } from "@/types";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { CategoryFeaturedProducts, CategoryRecommended, CategoryDescription } from "@/components/category";
import { SearchRecentlyViewed } from "@/components/search";

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
				<ProductSort resultCount={totalCount} />

				{/* Product Grid */}
				<ProductListLoadMore productListProps={{ products: products }} SWRResponse={rest} />
			</ProductListLayout>

			{/* Discovery Sections - Outside filter layout, truly full width */}
			<div className="space-y-0">
				{/* Trending Products (Best Sellers, Hot Deals) */}
				<div className="bg-white">
					<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
						<CategoryFeaturedProducts products={products} />
					</div>
				</div>

				{/* Recommended Products */}
				<div className="bg-[#f8fafc]">
					<div className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
						<CategoryRecommended products={products} />
					</div>
				</div>

				{/* Recently Viewed Products */}
				<div className="bg-white">
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
