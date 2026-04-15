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
								"mt-0.5 mb-1 flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold tracking-tight transition-all duration-200 sm:text-[13px]",
								isSelected
									? "border-info/55 bg-info/10 text-info shadow-[0_8px_16px_-12px_rgba(56,189,248,0.85)] ring-1 ring-info/22"
									: "border-border/85 bg-card/90 text-foreground/90 hover:border-foreground/35 hover:bg-accent/40 hover:text-foreground",
								outOfStock && "cursor-not-allowed opacity-40 bg-muted/30 line-through"
							)}
						>
							{isSelected ? (
								<span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.75px] border-current">
									<span className="h-1.5 w-1.5 rounded-full bg-current" />
								</span>
							) : (
								<span className="text-muted-foreground/45 h-3.5 w-3.5 shrink-0 rounded-full border-[1.75px] border-current" />
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
