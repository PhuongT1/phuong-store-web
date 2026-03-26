import React from "react";
import { Skeleton } from "../Skeleton";
import { SkeletonColumnLayout } from "./SkeletonColumnLayout";
import { cn } from "@/lib/utils";

type ColumnSkeletonProps = {
	columns?: number;
};

const ColumnSkeleton = ({ columns = 2 }: ColumnSkeletonProps) => {
	const getColumnWidth = () => {
		if (columns === 2) return "w-1/3";
		if (columns === 3) return "w-1/4";
		if (columns === 4) return "w-1/5";
		return "flex-1";
	};

	return (
		<SkeletonColumnLayout>
			{Array.from({ length: columns }).map((_, i) => (
				<Skeleton key={i} className={cn("h-4", getColumnWidth())} />
			))}
		</SkeletonColumnLayout>
	);
};

ColumnSkeleton.displayName = "ColumnSkeleton";

export { ColumnSkeleton };
