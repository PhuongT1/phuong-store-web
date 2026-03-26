import { PRODUCT_CARD_STRINGS } from "./productCard.constants";
import { StarIcon } from "@/assets/icons/StarIcon";
import { StarHalfIcon } from "@/assets/icons/StarHalfIcon";
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
}: ProductCardPriceProps) => (
	<div className="flex flex-1 flex-col gap-1.5 px-0.5 pb-0.5">
		{/* Product name — first for context */}
		<h3 className="line-clamp-2 text-[13px] leading-snug font-medium text-gray-800">{name}</h3>

		{/* Price block */}
		<div className="flex flex-col gap-0.5">
			{isOnSale && discounted && priceUndiscounted && (
				<div className="flex items-center gap-1.5">
					<span className="text-[11px] text-gray-400 line-through">{priceUndiscounted}</span>
					<span className="rounded bg-red-50 px-1 py-0.5 text-[10px] font-bold text-red-600">-{discounted}</span>
				</div>
			)}
			<span className="text-[17px] leading-tight font-bold tracking-tight text-gray-900">{price ?? "-"}</span>
			{savingsFormatted && (
				<span className="text-[11px] font-medium text-emerald-600">
					{PRODUCT_CARD_STRINGS.savingsPrefix}
					{savingsFormatted}
				</span>
			)}
		</div>

		{/* Rating + sold count — social proof below price */}
		{(ratingValue != null || soldCount != null) && (
			<div className="flex items-center gap-1 text-[11px] text-gray-400">
				{ratingValue != null && (() => {
					const full = Math.floor(ratingValue);
					const half = ratingValue - full >= 0.5;
					return (
						<>
							<div className="flex items-center gap-px">
								{Array.from({ length: 5 }).map((_, i) => {
									if (i < full)
										return <StarIcon key={i} svgProps={{ className: "h-2.5 w-2.5 fill-amber-400 text-amber-400" }} />;
									if (i === full && half)
										return <StarHalfIcon key={i} svgProps={{ className: "h-2.5 w-2.5 fill-amber-400 text-amber-400" }} />;
									return <StarOutlineIcon key={i} svgProps={{ className: "h-2.5 w-2.5 text-amber-300" }} />;
								})}
							</div>
							<span className="font-medium text-gray-500">{ratingValue}</span>
						</>
					);
				})()}
				{ratingValue != null && soldCount != null && <span className="opacity-40">•</span>}
				{soldCount != null && (
					<span>
						{PRODUCT_CARD_STRINGS.soldPrefix}
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
						className="rounded border border-gray-200 bg-gray-50 px-1.5 py-px text-[10px] font-medium text-gray-500"
					>
						{chip}
					</span>
				))}
			</div>
		)}
	</div>
);

export { ProductCardPrice };
