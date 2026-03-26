"use client";

import React from "react";
import { Skeleton } from "../Skeleton";
import { ImageSkeleton } from "../ImageSkeleton";
import { cn } from "@/lib/utils";

const CartLineSkeleton = () => {
	return (
		<li className="flex gap-2 flex-wrap items-center py-4 border-b border-gray-100 last:border-none">
			<ImageSkeleton skeletonProps={{ className: "rounded size-[72px]" }} imageProps={{ size: 55 }} />
			<div className="relative flex flex-1 gap-2 flex-col justify-between">
				<div className="flex justify-between justify-items-start gap-1">
					<div className="flex flex-1 flex-col gap-y-1">
						<Skeleton className="w-1/3" />
						<div className="flex gap-2">
							{Array.from({ length: 2 })?.map((_, index) => (
								<Skeleton key={index} size={"md"} className="w-1/3" />
							))}
						</div>
					</div>
					<Skeleton className="w-1/7" />
				</div>
			</div>
			<div className="flex w-full items-center justify-end gap-3">
				<Skeleton className="h-5 w-5" />
				<Skeleton size={"md"} className="w-1/6" />
			</div>
		</li>
	);
};
CartLineSkeleton.displayName = "CartLineSkeleton";

export { CartLineSkeleton };
