import React from "react";
import { Skeleton } from "@components/skeleton";

export const PaymentSectionSkeleton: React.FC = () => {
	return (
		<div className="py-2 sm:py-4">
			<div className="mb-3 flex items-center gap-2.5">
				<Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
				<Skeleton className="h-5 w-40" />
			</div>
			{/* 2 payment method radio items — matches RadioItem border variant (p-4 rounded-xl) */}
			<div className="flex flex-col gap-2.5">
				{/* COD */}
				<div className="border-border/60 bg-card flex items-center space-x-3 rounded-xl border p-4 shadow-sm">
					<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
					<div className="flex flex-col gap-1.5">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
				{/* VNPay */}
				<div className="border-border/60 bg-card flex items-center space-x-3 rounded-xl border p-4 shadow-sm">
					<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
					<div className="flex flex-col gap-1.5">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-56" />
					</div>
				</div>
			</div>
		</div>
	);
};
