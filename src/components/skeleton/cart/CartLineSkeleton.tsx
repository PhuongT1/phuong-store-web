"use client";

import React from "react";
import { ImageSkeleton } from "../ImageSkeleton";
import { Skeleton } from "../Skeleton";

const CartLineSkeleton = () => {
	return (
		<li className="border-border/40 flex gap-5 border-b p-5 last:border-none lg:gap-6 lg:p-6">
			<ImageSkeleton
				skeletonProps={{ className: "h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28" }}
				imageProps={{ size: 68 }}
			/>
			<div className="flex flex-1 flex-col justify-between gap-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-1 flex-col gap-1.5">
						<Skeleton className="h-5 w-3/4 rounded" />
						<Skeleton className="h-3.5 w-24 rounded-full" />
					</div>
					<Skeleton className="h-8 w-8 rounded-full" />
				</div>
				<div className="flex items-end justify-between">
					<Skeleton className="h-7 w-16 rounded-md" />
					<div className="flex flex-col items-end gap-1.5">
						<Skeleton className="h-6 w-24 rounded" />
						<Skeleton className="h-3.5 w-16 rounded-full" />
					</div>
				</div>
			</div>
		</li>
	);
};
CartLineSkeleton.displayName = "CartLineSkeleton";

export { CartLineSkeleton };
