import React from "react";
import { RatingProgress } from "@ui";
import { useTranslations } from "next-intl";
import { type SummaryRating } from "@/types";
import { getStars, Star } from "./HandleRender";

type ReviewSummaryTitleProps = SummaryRating & {
	onReviewsClick?: () => void;
};

export const ReviewSummaryTitle = ({ summary, onReviewsClick }: ReviewSummaryTitleProps) => {
	const t = useTranslations("rating");
	if (!summary) return null;

	const { averageRating, totalCount } = summary;
	const numberRating = Number(averageRating) || 0;

	return (
		<div className="mb-6 flex flex-col gap-1">
			<div className="text-rating flex items-end gap-2">
				{numberRating > 0 ? (
					<h3 className="text-5xl leading-none font-bold tracking-tighter">{numberRating.toFixed(1)}</h3>
				) : (
					<h3 className="text-5xl leading-none font-bold tracking-tighter">0.0</h3>
				)}
				<span className="text-foreground/60 mb-1 line-clamp-1 text-base font-medium"> / 5.0</span>
			</div>
			<div className="flex items-center gap-3">
				<span className="flex items-center text-rating">
					{getStars(numberRating).map((item, index) => (
						<React.Fragment key={index}>{Star(item)}</React.Fragment>
					))}
				</span>
				{onReviewsClick ? (
					<button
						type="button"
						className="text-muted-foreground text-sm font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline"
						onClick={onReviewsClick}
					>
						{totalCount} {t("reviews")}
					</button>
				) : (
					<span className="text-muted-foreground text-sm font-medium">
						{totalCount} {t("reviews")}
					</span>
				)}
			</div>
		</div>
	);
};

export const ReviewSummaryBars = ({ summary }: SummaryRating) => {
	if (!summary) return null;
	const { ratingDistribution } = summary;
	return (
		<div className="flex w-full flex-col gap-2">
			{ratingDistribution.map((item, index) => (
				<RatingProgress
					key={index}
					numberStart={item.rating}
					progress={{
						value: Number(item.percentage),
						indicatorclassName: "bg-rating",
						className: "bg-black/5 dark:bg-white/5 h-2 rounded-full"
					}}
				/>
			))}
		</div>
	);
};

type ReviewSummaryProps = SummaryRating & {
	onReviewsClick?: () => void;
};

export const ReviewSummary = ({ summary, onReviewsClick }: ReviewSummaryProps) => {
	return (
		<div className="flex flex-col gap-6 md:flex-row md:items-start">
			<div className="max-w-[300px] flex-1">
				<ReviewSummaryTitle summary={summary} onReviewsClick={onReviewsClick} />
			</div>
			<div className="max-w-[400px] flex-1">
				<ReviewSummaryBars summary={summary} />
			</div>
		</div>
	);
};
