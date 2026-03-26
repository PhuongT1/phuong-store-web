import React from "react";
import { RatingProgress } from "@ui";
import { getStars, Star } from "./HandleRender";
import { type SummaryRating } from "@/types";

const ReviewSummary = ({ summary }: SummaryRating) => {
	if (!summary) return null;

	const { averageRating, totalCount, ratingDistribution } = summary;
	const numberRating = averageRating;

	return (
		<>
			<div className="mb-4 flex items-center gap-1">
				{numberRating > 0 && <h3 className="text-4xl font-bold text-yellow-500">{numberRating}</h3>}
				<span className="flex items-center">
					{getStars(numberRating).map((item, index) => (
						<React.Fragment key={index}>{Star(item)}</React.Fragment>
					))}
				</span>
				<span className="text-sm text-gray-500">{totalCount} đánh giá</span>
			</div>
			<div className="mb-4 w-full max-w-[300px]">
				{ratingDistribution.map((item, index) => (
					<RatingProgress
						key={index}
						numberStart={item.rating}
						progress={{
							value: Number(item.percentage),
							indicatorclassName: "bg-yellow-400",
							className: "bg-gray-300"
						}}
					/>
				))}
			</div>
		</>
	);
};

export { ReviewSummary };
