import {
	SearchBestSellers,
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
};

/**
 * Server component — renders all homepage discovery sections.
 * Products are fetched SSR in page.tsx and passed down as props.
 */
const HomePageSections = ({ products }: HomePageSectionsProps) => (
	<div className="min-h-screen">
		<ContainerLayout className="py-6">
			{/* 1. Hero campaign carousel */}
			<SearchHero />

			{/* 2. Category shortcuts */}
			<SearchCategoryTiles />

			{/* 3. Trending / curated collections */}
			<SearchTrendingCollections />

			{/* 4. Best-selling products carousel */}
			<SearchBestSellers products={products} />

			{/* 5. Sale / hot deals */}
			<SearchHotDeals products={products} />

			{/* 6. New arrivals */}
			<SearchNewArrivals products={products} />

			{/* 7. Recommended for you */}
			<SearchRecommended products={products} />

			{/* 8. Continue shopping (recently viewed — localStorage, client-side) */}
			<SearchRecentlyViewed products={products} />
		</ContainerLayout>
	</div>
);

HomePageSections.displayName = "HomePageSections";

export { HomePageSections };
