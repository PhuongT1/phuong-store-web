"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { type ProductItem } from "@/lib/utils";
import { RatingDialog, RatingForm, ProductReviewList, ReviewSummary } from "@components/product";
import { Button } from "@components/ui";
import { useRatingInfinite } from "@hooks/useRatingProduct";

type RatingDetailProps = ProductItem;

const RatingDetail = ({ product }: RatingDetailProps) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const { ratings, setSize, summary, remainingItems, hasNextPage, mutate } = useRatingInfinite({
		first: 30,
		id: product?.id
	});

	const { form, submit } = RatingForm({
		product,
		onSuccess: () => {
			void mutate();
			setOpen(false);
		}
	});

	if (!ratings) return <></>;

	return (
		<div className="bg-card p-3 md:rounded-lg md:p-5">
			<h3 className="title">Đánh giá về sản phẩm</h3>
			<ReviewSummary summary={summary} />
			<Button variant={"default"} size={"lg"} className="w-full max-w-[300px]" onClick={() => setOpen(true)}>
				Viết đánh giá
			</Button>
			<ProductReviewList data={ratings} />
			<RatingDialog
				alertDialogProps={{ open: isOpen }}
				onCancelClick={() => setOpen(false)}
				onSubmit={submit}
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
					<ChevronDown className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export { RatingDetail };
