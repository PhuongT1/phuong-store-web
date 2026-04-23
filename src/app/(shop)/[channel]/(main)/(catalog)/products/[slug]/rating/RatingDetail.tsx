"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn, type ProductItem } from "@/lib/utils";
import { RatingDialog, RatingForm, ProductReviewList, ReviewSummary } from "@components/product";
import { Button } from "@components/ui";
import { useRatingInfinite } from "@hooks/useRatingProduct";

type RatingDetailProps = ProductItem & {
	maxItems?: number;
	embedded?: boolean;
};

const RatingDetail = ({ product, maxItems, embedded = false }: RatingDetailProps) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const { ratings, setSize, summary, remainingItems, hasNextPage, mutate } = useRatingInfinite({
		first: embedded ? 24 : 30,
		id: product?.id,
		maxItems
	});

	const { form, submit } = RatingForm({
		product,
		onSettled: () => {
			void mutate();
			setOpen(false);
		}
	});

	if (!ratings) return <></>;

	return (
		<div
			className={cn(
				embedded ? "bg-transparent p-0" : "bg-card p-3 md:rounded-lg md:p-5",
				"flex flex-col gap-5"
			)}
		>
			<h3 className={cn(embedded ? "text-foreground text-2xl font-semibold tracking-tight" : "title")}>
				Đánh giá về sản phẩm
			</h3>
			<ReviewSummary summary={summary} />
			<Button
				variant={"default"}
				size={"lg"}
				className={cn("w-full max-w-[300px]", embedded && "max-w-full sm:max-w-[260px]")}
				onClick={() => setOpen(true)}
			>
				Viết đánh giá
			</Button>
			<ProductReviewList data={ratings} />
			<RatingDialog
				alertDialogProps={{ open: isOpen, onOpenChange: setOpen }}
				onCancelClick={() => setOpen(false)}
				onSubmit={submit}
			>
				{form()}
			</RatingDialog>
			{hasNextPage && (
				<Button
					variant={"outline"}
					size={"lg"}
					className={cn("my-1 w-full max-w-[300px]", embedded && "max-w-full sm:max-w-[260px]")}
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
