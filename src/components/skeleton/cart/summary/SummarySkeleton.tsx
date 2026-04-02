import React from "react";
import { SummaryCard } from "@/components/cart/summary/SummaryCard";
import { Separator } from "@components/ui";
import { SkeletonColumnLayout } from "../../column-layout/SkeletonColumnLayout";
import { Skeleton } from "../../Skeleton";

const SummarySkeleton = () => {
	return (
		<SummaryCard>
			{/* Promo code input */}
			<Skeleton className="h-10 w-full rounded-md" />
			<Separator />
			{/* Subtotal row */}
			<SkeletonColumnLayout>
				<Skeleton className="w-1/5" />
				<Skeleton className="w-1/6" />
			</SkeletonColumnLayout>
			{/* Shipping row */}
			<SkeletonColumnLayout>
				<Skeleton className="w-1/4" />
				<Skeleton className="w-1/6" />
			</SkeletonColumnLayout>
			<Separator />
			{/* Total row */}
			<SkeletonColumnLayout>
				<Skeleton className="w-1/3" size="md" />
				<Skeleton className="w-1/4" size="md" />
			</SkeletonColumnLayout>
		</SummaryCard>
	);
};
SummarySkeleton.displayName = "SummarySkeleton";

export { SummarySkeleton };
