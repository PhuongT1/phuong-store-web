"use client";

import { useContext, useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { useRatingInfinite } from "@/hooks/useRatingProduct";
import { type Pages } from "@/types";
import {
	RatingDialog,
	ProductContext,
	RatingForm,
	ProductReviewList,
	ReviewSummary
} from "@components/product";
import { ProductRatingSkeleton } from "@components/skeleton";
import { Button } from "@components/ui";
import { RatingLink } from "./RatingLink";

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
	const { form, submit } = RatingForm({
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
		<div className="bg-card p-3 md:rounded-lg md:p-5 md:pr-[30%]">
			<h3 className="title size-md">Khách hàng đánh giá về {product?.name}</h3>
			<ReviewSummary summary={summary} />
			<ProductReviewList data={ratings} />
			<RatingDialog
				alertDialogProps={{ open: isOpen }}
				onCancelClick={() => setOpen(false)}
				onSubmit={submit}
			>
				{form()}
			</RatingDialog>
			<div className="grid w-full grid-cols-2 gap-2">
				{hasNextPage && (
					<RatingLink className="w-full" product={product}>
						<Button variant={"outline"} size={"lg"} className="w-full">
							Xem thêm {remaining} đánh giá
							<ChevronDown className="h-4 w-4" />
						</Button>
					</RatingLink>
				)}
				<Button variant={"default"} size={"lg"} onClick={addIsOpenParam}>
					<Pencil className="h-4 w-4" />
					Viết đánh giá
				</Button>
			</div>
		</div>
	);
};

export { ProductRating };
