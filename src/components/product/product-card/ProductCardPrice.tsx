import { useTranslations } from "next-intl";

type ProductCardPriceProps = {
	name: string;
	price: string | null | undefined;
	discounted?: string | null;
	priceUndiscounted?: string | null;
	isOnSale: boolean;
	savingsFormatted: string | null;
	specChips: string[];
};

const ProductCardPrice = ({
	name,
	price,
	discounted,
	priceUndiscounted,
	isOnSale,
	savingsFormatted,
	specChips
}: ProductCardPriceProps) => {
	const t = useTranslations("product");

	return (
		<div className="flex flex-1 flex-col gap-2 px-0.5">
			{/* Product name — first for context */}
			<h3 className="text-card-foreground/95 line-clamp-2 text-[13px] leading-[1.35] font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-foreground sm:text-[15px] lg:text-[15px]">
				{name}
			</h3>

			{/* Price block */}
			<div className="flex flex-col gap-1">
				{isOnSale && discounted && priceUndiscounted && (
					<div className="flex items-center gap-1.5">
						<span className="text-muted-foreground text-[11px] line-through sm:text-[13px]">{priceUndiscounted}</span>
						<span className="bg-price-accent text-price rounded-full border border-price/25 px-2 py-0.5 text-[10px] font-bold sm:text-[11px]">
							-{discounted}
						</span>
					</div>
				)}
				<span className="text-price text-[15px] leading-tight font-bold tracking-[-0.012em] sm:text-lg lg:text-[19px]">
					{price ?? "-"}
				</span>
				{savingsFormatted && (
					<span className="text-savings inline-flex w-fit rounded-full bg-savings/14 px-2 py-0.5 text-[11px] font-semibold tracking-[-0.01em] sm:text-[12px] lg:text-[13px]">
						{t("savingsPrefix")}
						{savingsFormatted}
					</span>
				)}
			</div>

			{/* Spec attribute chips */}
			{specChips.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{specChips.map((chip, i) => (
						<span
							key={i}
							className="border-border/72 bg-secondary/74 text-muted-foreground rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[-0.01em] truncate max-w-full sm:text-[11px]"
						>
							{chip}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

export { ProductCardPrice };
