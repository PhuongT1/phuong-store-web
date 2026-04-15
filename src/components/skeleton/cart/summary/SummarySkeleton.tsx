import React from "react";
import { SummaryCard } from "@/components/cart/summary/SummaryCard";
import { Separator } from "@components/ui";
import { SkeletonColumnLayout } from "../../column-layout/SkeletonColumnLayout";
import { Skeleton } from "../../Skeleton";

const SummarySkeleton = () => {
	return (
		<SummaryCard>
			<Skeleton className="h-10 w-full rounded-md" />
			<Separator />
			<div className="flex max-w-full flex-col">
				<SkeletonColumnLayout>
					<Skeleton className="h-4 w-20 rounded-full" />
					<Skeleton className="h-4 w-24 rounded-full" />
				</SkeletonColumnLayout>
				<SkeletonColumnLayout>
					<Skeleton className="h-4 w-16 rounded-full" />
					<Skeleton className="h-4 w-20 rounded-full" />
				</SkeletonColumnLayout>
				<SkeletonColumnLayout>
					<Skeleton className="h-4 w-24 rounded-full" />
					<Skeleton className="h-4 w-24 rounded-full" />
				</SkeletonColumnLayout>
				<Separator className="my-4" />
				<div className="flex items-baseline justify-between pb-4">
					<div className="flex items-baseline gap-2">
						<Skeleton className="h-5 w-12 rounded-full" />
						<Skeleton className="h-3 w-8 rounded-full" />
						<Skeleton className="h-3 w-24 rounded-full" />
					</div>
					<Skeleton className="h-6 w-24 rounded" />
				</div>
			</div>
		</SummaryCard>
	);
};
SummarySkeleton.displayName = "SummarySkeleton";

export { SummarySkeleton };
