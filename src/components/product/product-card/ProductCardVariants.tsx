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
	if (variants.length <= 1) {
		return <div aria-hidden="true" className="mt-3 min-h-[54px] border-t border-border/60 pt-3" />;
	}

	return (
		<div className="border-border/60 mt-3 min-h-[54px] border-t pt-3">
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
								"mt-0.5 mb-1 flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[12px] font-semibold tracking-tight transition-all duration-200 sm:text-[13px]",
								isSelected
									? "border-info/55 bg-info/12 text-info shadow-sm"
									: "border-border bg-card text-foreground/90 hover:border-foreground/30 hover:text-foreground",
								outOfStock && "cursor-not-allowed opacity-40 bg-muted/30 line-through"
							)}
						>
							{isSelected ? (
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:h-[13px] sm:w-[13px]"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
							) : (
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/45 shrink-0 sm:h-[13px] sm:w-[13px]"><circle cx="12" cy="12" r="10"/></svg>
							)}
							<span className="truncate">{variant.name}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export { ProductCardVariants };
