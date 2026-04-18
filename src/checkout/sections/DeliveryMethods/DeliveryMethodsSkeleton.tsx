import React from "react";
import { Skeleton } from "@components/skeleton";

export const DeliveryMethodsSkeleton = () => {
	return (
		<div className="mt-2 py-2 sm:py-4">
			<div className="mb-3 flex items-center gap-2.5">
				<Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
				<Skeleton className="h-5 w-32" />
			</div>
			<div className="grid grid-cols-1 gap-3 sm:gap-4">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="bg-secondary/38 min-[1025px]:border-border/60 min-[1025px]:bg-card flex items-center space-x-3 rounded-xl p-3 shadow-none min-[1025px]:border min-[1025px]:p-4 min-[1025px]:shadow-sm"
					>
						<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
						<div className="flex min-w-0 flex-1 flex-col gap-2.5">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-12" />
							</div>
							<Skeleton className="h-3 w-40" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
