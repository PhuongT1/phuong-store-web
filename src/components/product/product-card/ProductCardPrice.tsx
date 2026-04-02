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
		<div className="flex flex-1 flex-col gap-1.5 px-0.5 pb-0.5">
			{/* Product name — first for context */}
			<h3 className="text-card-foreground line-clamp-2 text-base leading-snug font-medium">{name}</h3>

			{/* Price block */}
			<div className="flex flex-col gap-0.5">
				{isOnSale && discounted && priceUndiscounted && (
					<div className="flex items-center gap-1.5">
						<span className="text-muted-foreground text-sm line-through">{priceUndiscounted}</span>
						<span className="bg-price-accent text-price rounded px-1 py-0.5 text-xs font-bold">
							-{discounted}
						</span>
					</div>
				)}
				<span className="text-price text-xl leading-tight font-bold tracking-tight">{price ?? "-"}</span>
				{savingsFormatted && (
					<span className="text-sm font-medium text-savings">
						{t("savingsPrefix")}
						{savingsFormatted}
					</span>
				)}
			</div>

			{/* Rating + sold count — social proof below price */}
			{(ratingValue != null || soldCount != null) && (
				<div className="text-muted-foreground flex items-center gap-1 text-sm">
					{ratingValue != null &&
						(() => {
							const full = Math.floor(ratingValue);
							const half = ratingValue - full >= 0.5;
							return (
								<>
									<div className="flex items-center gap-px">
										{Array.from({ length: 5 }).map((_, i) => {
											if (i < full)
												return (
													<StarIcon
														key={i}
														svgProps={{ className: "h-2.5 w-2.5 fill-rating text-rating" }}
													/>
												);
											if (i === full && half)
												return (
													<StarHalfIcon
														key={i}
														svgProps={{ className: "h-2.5 w-2.5 fill-rating text-rating" }}
													/>
												);
											return (
												<StarOutlineIcon key={i} svgProps={{ className: "h-2.5 w-2.5 text-rating/50" }} />
											);
										})}
									</div>
									<span className="text-muted-foreground font-medium">{ratingValue}</span>
								</>
							);
						})()}
					{ratingValue != null && soldCount != null && <span className="opacity-40">•</span>}
					{soldCount != null && (
						<span>
							{t("soldPrefix")}
							{soldCount}
						</span>
					)}
				</div>
			)}

			{/* Spec attribute chips */}
			{specChips.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{specChips.map((chip, i) => (
						<span
							key={i}
							className="border-border bg-secondary text-muted-foreground rounded border px-1.5 py-0.5 text-xs font-medium"
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
