"use client";

import { Button, Separator } from "@components/ui";
import { RatingLink } from "./RatingLink";
import { StarIcon } from "@/assets/icons/StarIcon";
import { useRatingInfinite } from "@/hooks/useRatingProduct";
import { type ProductItem } from "@/lib/utils";

type HandleRatingSummaryProps = ProductItem;

const HandleRatingSummary = ({ product }: HandleRatingSummaryProps) => {
	const { ratings, summary } = useRatingInfinite({
		first: 2,
		id: product?.id
	});

	if (!ratings) return <></>;

	return (
		<div className="mb-3 flex items-center gap-3">
			{summary?.totalCount > 0 && (
				<>
					<p className=" flex items-center gap-1 text-sm text-gray-600">
						<StarIcon /> <span>{summary?.averageRating ?? 0}</span>
					</p>
					<Separator orientation="vertical" className="h-4" />
				</>
			)}
			<RatingLink product={product}>
				<Button variant={"link"} size={"link"} className="w-full">
					{summary?.totalCount ?? 0} đánh giá
				</Button>
			</RatingLink>
		</div>
	);
};

export { HandleRatingSummary };
