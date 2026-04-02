"use client";

import { type ProductDetailsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";

type Variants = NonNullable<ProductDetailsQuery["product"]>["variants"];

type ProductCardVariantsProps = {
	variants: NonNullable<Variants>;
	selectedVariantId: string;
	onSelect: (e: React.MouseEvent, variantId: string) => void;
};

/** Renders inline variant selector chips. Returns null when only one variant exists. */
const ProductCardVariants = ({ variants, selectedVariantId, onSelect }: ProductCardVariantsProps) => {
	if (variants.length <= 1) return null;

	return (
		<div className="border-border mt-3 border-t pt-3">
			<div className="flex flex-wrap gap-1.5">
				{variants.map((variant) => {
					const isSelected = variant.id === selectedVariantId;
					const outOfStock = !variant.quantityAvailable;

					return (
						<button
							key={variant.id}
							onClick={(e) => onSelect(e, variant.id)}
							disabled={outOfStock}
							className={cn(
								"rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200",
								isSelected
									? "border-primary bg-primary/8 text-primary shadow-sm"
									: "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
								outOfStock && "cursor-not-allowed line-through opacity-35"
							)}
						>
							{variant.name}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export { ProductCardVariants };
