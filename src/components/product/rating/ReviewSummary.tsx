import React from "react";
import { RatingProgress } from "@ui";
import { useTranslations } from "next-intl";
import { type SummaryRating } from "@/types";
import { getStars, Star } from "./HandleRender";

const ReviewSummary = ({ summary }: SummaryRating) => {
	const t = useTranslations("rating");
	if (!summary) return null;

	const { averageRating, totalCount, ratingDistribution } = summary;
	const numberRating = averageRating;

	return (
		<>
			<div className="mb-4 flex items-center gap-1">
				{numberRating > 0 && <h3 className="text-4xl font-bold text-rating">{numberRating}</h3>}
				<span className="flex items-center">
					{getStars(numberRating).map((item, index) => (
						<React.Fragment key={index}>{Star(item)}</React.Fragment>
					))}
				</span>
				<span className="text-muted-foreground text-sm">
					{totalCount} {t("reviews")}
				</span>
			</div>
			<div className="mb-4 w-full max-w-[300px]">
				{ratingDistribution.map((item, index) => (
					<RatingProgress
						key={index}
						numberStart={item.rating}
						progress={{
							value: Number(item.percentage),
							indicatorclassName: "bg-rating",
							className: "bg-muted"
						}}
					/>
				))}
			</div>
		</>
	);
};

export { ReviewSummary };
