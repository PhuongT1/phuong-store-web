import { type ProductListProps } from "@/types";
import { ProductElement } from "@components/product";
import { suggestionData } from "../data/searchData";

const SearchTrendingGrid = ({ products }: ProductListProps) => {
	const hasProducts = products && products.length > 0;

	return (
		<section className="mt-10">
			<div className="mb-4">
				<p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">Trending now</p>
				<h3 className="text-foreground mt-2 text-2xl font-semibold">Best sellers and new drops</h3>
			</div>
			{hasProducts ? (
				<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					{products.slice(0, 8).map((product, index) => (
						<ProductElement
							key={product?.id ?? index}
							product={product}
							priority={index < 2}
							loading={index < 3 ? "eager" : "lazy"}
						/>
					))}
				</ul>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					{suggestionData.products.map((item) => (
						<div key={item.name} className="border-border bg-card rounded-none border p-4">
							<div className="bg-muted text-muted-foreground flex aspect-[4/5] items-center justify-center text-xs">
								Preview
							</div>
							<p className="text-foreground mt-3 text-sm font-semibold">{item.name}</p>
							<p className="text-muted-foreground text-xs">{item.price}</p>
						</div>
					))}
				</div>
			)}
		</section>
	);
};

export { SearchTrendingGrid };
