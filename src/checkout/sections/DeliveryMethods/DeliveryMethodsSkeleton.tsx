import React from "react";
import { Skeleton } from "@/checkout/components";

export const DeliveryMethodsSkeleton = () => {
	return (
		<div className="py-4">
			<Skeleton variant="title" className="mb-2 w-40" />
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex items-center space-x-2 rounded-lg border border-neutral-200 px-3 py-2">
						<Skeleton className="h-4 w-4 min-w-4 shrink-0 rounded-full" />
						<div className="flex min-w-0 flex-1 items-center justify-between">
							<Skeleton className="h-4 min-w-0 flex-1" />
							<Skeleton className="ml-3 h-4 w-14 min-w-0 shrink-0" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
