import React from "react";
import { ColumnSkeleton } from "./ColumnSkeleton";
import { cn } from "@/lib/utils";

type ListColumnSkeletonProps = {
	columns?: number;
	rows?: number;
	className?: string;
};

const ListColumnSkeleton = ({ columns = 2, rows = 2, className }: ListColumnSkeletonProps) => {
	return (
		<div className={cn("flex flex-col space-y-5", className)}>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<ColumnSkeleton key={rowIndex} columns={columns} />
			))}
		</div>
	);
};
ListColumnSkeleton.displayName = "ListColumnSkeleton";

export { ListColumnSkeleton };
