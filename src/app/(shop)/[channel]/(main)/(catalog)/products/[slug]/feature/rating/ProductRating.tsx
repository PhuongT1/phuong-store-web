"use client";

import { useContext, useState } from "react";
import {
	RatingDialog,
	ProductContext,
	RatingForm,
	ProductReviewList,
	ReviewSummary
} from "@components/product";
import { Button } from "@components/ui";
import { ProductRatingSkeleton } from "@components/skeleton";
import { RatingLink } from "./RatingLink";
import { type Pages } from "@/types";
import { useRatingInfinite } from "@/hooks/useRatingProduct";

type ProductRatingProps = { params: Pages };

const ProductRating = ({}: ProductRatingProps) => {
	const { product } = useContext(ProductContext);
	const {
		ratings,
		summary,
		mutate,
		remainingItems: remaining,
		hasNextPage,
		isLoading
	} = useRatingInfinite({
		first: 2,
		id: product?.id
	});

	const [isOpen, setOpen] = useState<boolean>(false);
	const {
		form,
		method: { handleSubmit }
	} = RatingForm({
		onSuccess: () => {
			void mutate();
			setOpen(false);
		}
	});

	if (isLoading) return <ProductRatingSkeleton />;

	const addIsOpenParam = () => {
		setOpen(true);
	};

	return (
		<div className="bg-white p-3 md:rounded-lg md:p-5 md:pr-[30%]">
			<h3 className="title size-md">Khách hàng đánh giá về {product?.name}</h3>
			<ReviewSummary summary={summary} />
			<ProductReviewList data={ratings} />
			<RatingDialog
				alertDialogProps={{ open: isOpen }}
				onCancelClick={() => setOpen(false)}
				onSubmit={handleSubmit}
			>
				{form()}
			</RatingDialog>
			<div className="grid w-full grid-cols-2 gap-2">
				{hasNextPage && (
					<RatingLink className=" w-full" product={product}>
						<Button variant={"outline"} size={"lg"} className="w-full">
							Xem thêm {remaining} đánh giá
						</Button>
					</RatingLink>
				)}
				<Button variant={"default"} size={"lg"} onClick={addIsOpenParam}>
					Viết đánh giá
				</Button>
			</div>
		</div>
	);
};

export { ProductRating };
