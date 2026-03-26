import React from "react";
import { Separator } from "@components/ui";
import { SkeletonColumnLayout } from "../../column-layout/SkeletonColumnLayout";
import { Skeleton } from "../../Skeleton";
import { SummaryCard } from "@/components/cart/summary/SummaryCard";

const SummarySkeleton = () => {
	return (
		<SummaryCard>
			<SkeletonColumnLayout>
				<Skeleton className="w-1/6" />
				<Skeleton className="w-1/6" />
			</SkeletonColumnLayout>
			<SkeletonColumnLayout>
				<Skeleton className="w-1/4" />
				<Skeleton className="w-1/6" />
			</SkeletonColumnLayout>
			<Separator />
			<SkeletonColumnLayout>
				<Skeleton className="w-1/3" />
				<Skeleton className="w-1/4" />
			</SkeletonColumnLayout>
		</SummaryCard>
	);
};
SummarySkeleton.displayName = "SummarySkeleton";

export { SummarySkeleton };
