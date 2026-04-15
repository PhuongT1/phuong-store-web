"use client";

import { ProductElementSkeleton } from "./ProductElementSkeleton";

/**
 * Renders a responsive grid of product card skeletons.
 * Uses CSS classes to show/hide items per breakpoint — no JS device detection
 * so the skeleton is correct on first paint (SSR + hydration).
 */
const ProductListSkeleton = () => {
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4 lg:gap-3.5"
		>
			{/* index 0-3 — always visible to mirror 2-column mobile grid */}
			<ProductElementSkeleton />
			<ProductElementSkeleton />
			<ProductElementSkeleton />
			<ProductElementSkeleton />
			{/* extra row on tablet/desktop */}
			<ProductElementSkeleton className="hidden sm:block" />
			<ProductElementSkeleton className="hidden sm:block" />
			{/* fourth column companions on desktop */}
			<ProductElementSkeleton className="hidden lg:block" />
			<ProductElementSkeleton className="hidden lg:block" />
		</ul>
	);
};
ProductListSkeleton.displayName = "ProductListSkeleton";

export { ProductListSkeleton };
