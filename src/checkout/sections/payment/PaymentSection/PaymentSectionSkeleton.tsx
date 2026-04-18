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
			<div className="flex flex-col gap-3 sm:gap-4">
				{/* COD */}
				<div className="bg-secondary/38 min-[1025px]:border-border/60 min-[1025px]:bg-card flex items-center space-x-3 rounded-xl p-3 shadow-none min-[1025px]:border min-[1025px]:p-4 min-[1025px]:shadow-sm">
					<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
					<div className="flex flex-col gap-2.5">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
				{/* VNPay */}
				<div className="bg-secondary/38 min-[1025px]:border-border/60 min-[1025px]:bg-card flex items-center space-x-3 rounded-xl p-3 shadow-none min-[1025px]:border min-[1025px]:p-4 min-[1025px]:shadow-sm">
					<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
					<div className="flex flex-col gap-2.5">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-56" />
					</div>
				</div>
			</div>
		</div>
	);
};
