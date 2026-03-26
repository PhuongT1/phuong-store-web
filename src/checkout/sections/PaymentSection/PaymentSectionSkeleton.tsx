import React from "react";
import { Skeleton } from "@/checkout/components";

export const PaymentSectionSkeleton: React.FC = () => {
	return (
		<div className="py-4">
			<Skeleton variant="title" className="mb-4 w-48" />
			{/* 2 payment method radio items — matches RadioItem border variant (px-3 py-2 rounded-lg) */}
			<div className="flex flex-col gap-3">
				{/* COD */}
				<div className="flex items-center space-x-2 rounded-lg border border-neutral-200 px-3 py-2">
					<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
					<div className="flex flex-col gap-1">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
				{/* VNPay */}
				<div className="flex items-center space-x-2 rounded-lg border border-neutral-200 px-3 py-2">
					<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
					<div className="flex flex-col gap-1">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-56" />
					</div>
				</div>
			</div>
		</div>
	);
};
