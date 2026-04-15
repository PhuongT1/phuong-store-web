import { useTranslations } from "next-intl";
import { StarHalfIcon } from "@/assets/icons/StarHalfIcon";
import { StarIcon } from "@/assets/icons/StarIcon";
import { StarOutlineIcon } from "@/assets/icons/StarOutlineIcon";

type ProductCardPriceProps = {
	name: string;
	price: string | null | undefined;
	discounted?: string | null;
	priceUndiscounted?: string | null;
	isOnSale: boolean;
	savingsFormatted: string | null;
	ratingValue: number | null;
	soldCount: string | null;
	specChips: string[];
};

const ProductCardPrice = ({
	name,
	price,
	discounted,
	priceUndiscounted,
	isOnSale,
	savingsFormatted,
	ratingValue,
	soldCount,
	specChips
}: ProductCardPriceProps) => {
	const t = useTranslations("product");

	return (
		<div className="flex flex-1 flex-col gap-1.5 px-0.5">
			{/* Product name — first for context */}
			<h3 className="text-card-foreground line-clamp-2 text-[13px] leading-snug font-medium sm:text-[15px] lg:text-[15px]">
				{name}
			</h3>

			{/* Price block */}
			<div className="flex flex-col gap-0.5">
				{isOnSale && discounted && priceUndiscounted && (
					<div className="flex items-center gap-1.5">
						<span className="text-muted-foreground text-[11px] line-through sm:text-[13px]">{priceUndiscounted}</span>
						<span className="bg-price-accent text-price rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold">
							-{discounted}
						</span>
					</div>
				)}
				<span className="text-price text-[15px] leading-tight font-bold tracking-tight sm:text-lg lg:text-[19px]">
					{price ?? "-"}
				</span>
				{savingsFormatted && (
					<span className="text-savings text-[11px] font-medium sm:text-[13px] lg:text-sm">
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
							className="border-border bg-secondary/70 text-muted-foreground rounded-md border px-1.5 py-0.5 text-[10px] font-medium truncate max-w-full sm:text-[11px]"
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
