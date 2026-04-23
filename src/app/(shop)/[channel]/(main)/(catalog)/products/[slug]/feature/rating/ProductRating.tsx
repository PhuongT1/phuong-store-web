"use client";

import { useContext, useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { useRatingInfinite } from "@/hooks/useRatingProduct";
import { type Pages } from "@/types";
import {
	RatingDialog,
	ProductContext,
	RatingForm,
	ProductReviewList
} from "@components/product";
import { ReviewSummaryTitle, ReviewSummaryBars } from "@components/product/rating/ReviewSummary";
import { ProductRatingSkeleton } from "@components/skeleton";
import { Button } from "@components/ui";
import { ProductRatingPanel } from "./ProductRatingPanel";

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
	const totalReviews = Number(summary?.totalCount ?? 0);

	const [isOpen, setOpen] = useState<boolean>(false);
	const [isPanelOpen, setPanelOpen] = useState(false);
	const { form, submit } = RatingForm({
		onSettled: () => {
			void mutate();
			setOpen(false);
		}
	});

	if (isLoading) return <ProductRatingSkeleton />;

	const addIsOpenParam = () => {
		setOpen(true);
	};

	return (
		<div className="flex w-full flex-col gap-6 sm:gap-8">
			<div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:justify-between lg:gap-10">
				<div className="flex w-full flex-col gap-5 md:w-1/2 lg:w-5/12">
					<div className="flex flex-col gap-2">
						<h3 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Đánh giá</h3>
						<p className="text-muted-foreground text-sm">Khách hàng chia sẻ trải nghiệm về {product?.name}</p>
					</div>

					<ReviewSummaryTitle
						summary={summary}
						onReviewsClick={totalReviews > 0 ? () => setPanelOpen(true) : undefined}
					/>

					<div className="mt-1 text-left">
						<Button
							className="h-12 w-full rounded-full font-medium sm:w-auto sm:px-8"
							variant="default"
							onClick={addIsOpenParam}
						>
							<Pencil className="mr-2 h-4 w-4" />
							Viết đánh giá
						</Button>
					</div>
				</div>
				<div className="flex w-full flex-col justify-center pt-1 md:w-1/2 lg:max-w-md">
					<ReviewSummaryBars summary={summary} />
				</div>
			</div>

			<div className="border-border/40 w-full border-t" />

			<div className="flex w-full flex-col gap-6">
				<ProductReviewList data={ratings} />
				{hasNextPage && (
					<div className="border-border/40 mt-2 pt-4">
						<Button
							variant="outline"
							className="bg-card hover:bg-accent hover:text-accent-foreground border-border/60 h-12 w-full rounded-full font-medium"
							onClick={() => setPanelOpen(true)}
						>
							Xem thêm {remaining} đánh giá
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				)}
			</div>

			{totalReviews > 0 ? (
				<ProductRatingPanel
					product={product}
					open={isPanelOpen}
					onOpenChange={setPanelOpen}
					trigger={<span className="hidden" aria-hidden="true" />}
				/>
			) : null}

			<RatingDialog
				alertDialogProps={{ open: isOpen }}
				onCancelClick={() => setOpen(false)}
				onSubmit={submit}
			>
				{form()}
			</RatingDialog>
		</div>
	);
};

export { ProductRating };
