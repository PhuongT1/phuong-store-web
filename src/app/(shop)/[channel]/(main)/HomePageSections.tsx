import {
	SearchBestSellers,
	SearchBlogPosts,
	SearchCategoryTiles,
	SearchHero,
	SearchHotDeals,
	SearchNewArrivals,
	SearchRecentlyViewed,
	SearchRecommended,
	SearchTrendingCollections
} from "@/components/search";
import { type ProductFragment } from "@/gql/graphql";
import { ContainerLayout } from "@components/layouts";

type HomePageSectionsProps = {
	products: ProductFragment[];
	channel: string;
};

/**
 * Server component — renders all homepage discovery sections.
 * Products are fetched SSR in page.tsx and passed down as props.
 */
const HomePageSections = ({ products, channel }: HomePageSectionsProps) => (
	<div className="min-h-screen">
		<ContainerLayout className="py-6">
			{/* 1. Hero campaign carousel */}
			<SearchHero />

			{/* 2. Category shortcuts (real Saleor data) */}
			<SearchCategoryTiles channel={channel} />

			{/* 3. Trending / curated collections (real Saleor data) */}
			<SearchTrendingCollections channel={channel} />

			{/* 4. Best-selling products carousel */}
			<SearchBestSellers products={products} />

			{/* 5. Sale / hot deals */}
			<SearchHotDeals products={products} />

			{/* 6. New arrivals */}
			<SearchNewArrivals products={products} />

			{/* 7. Recommended for you */}
			<SearchRecommended products={products} />

			{/* 8. Blog posts & trend articles slider */}
			<SearchBlogPosts />

			{/* 9. Continue shopping (recently viewed — localStorage, client-side) */}
			<SearchRecentlyViewed products={products} />
		</ContainerLayout>
	</div>
);

HomePageSections.displayName = "HomePageSections";

export { HomePageSections };
