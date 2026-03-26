"use client";

import { useState } from "react";
import { RatingDialog, RatingForm, ProductReviewList, ReviewSummary } from "@components/product";
import { useRatingInfinite } from "@hooks/useRatingProduct";
import { Button } from "@components/ui";
import { type ProductItem } from "@/lib/utils";

type RatingDetailProps = ProductItem;

const RatingDetail = ({ product }: RatingDetailProps) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const { ratings, setSize, summary, remainingItems, hasNextPage, mutate } = useRatingInfinite({
		first: 30,
		id: product?.id
	});

	const {
		form,
		method: { handleSubmit }
	} = RatingForm({
		product,
		onSuccess: () => {
			void mutate();
			setOpen(false);
		}
	});

	if (!ratings) return <></>;

	return (
		<div className="bg-white p-3 md:rounded-lg md:p-5">
			<h3 className="title">Đánh giá về sản phẩm</h3>
			<ReviewSummary summary={summary} />
			<Button variant={"default"} size={"lg"} className="w-full max-w-[300px]" onClick={() => setOpen(true)}>
				Viết đánh giá
			</Button>
			<ProductReviewList data={ratings} />
			<RatingDialog
				alertDialogProps={{ open: isOpen }}
				onCancelClick={() => setOpen(false)}
				onSubmit={handleSubmit}
			>
				{form()}
			</RatingDialog>
			{hasNextPage && (
				<Button
					variant={"outline"}
					size={"lg"}
					className="my-4 w-full max-w-[300px]"
					onClick={() => setSize((pre) => pre + 1)}
				>
					Xem thêm {remainingItems} đánh giá
				</Button>
			)}
		</div>
	);
};

export { RatingDetail };
