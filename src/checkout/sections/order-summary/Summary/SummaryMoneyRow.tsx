import React, { type PropsWithChildren } from "react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { MoneyDisplay, type MoneyDisplayProps } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface SummaryMoneyRowProps extends MoneyDisplayProps {
	label: string;
	isLoading?: boolean;
	compact?: boolean;
}

export const SummaryMoneyRow: React.FC<PropsWithChildren<SummaryMoneyRowProps>> = ({
	label,
	children,
	className,
	isLoading,
	compact = false,
	...moneyProps
}) => {
	return (
		<div
			className={cn(
				"flex flex-row items-center justify-between",
				compact ? "mb-1.5 gap-2 min-[1025px]:mb-2 min-[1025px]:gap-3" : "mb-1.5 gap-2 sm:mb-2 sm:gap-3"
			)}
		>
			<div className="flex flex-row items-center">
				<p
					className={cn(
						"text-muted-foreground",
						compact ? "text-[14px] min-[1025px]:text-[15px]" : "text-[14px] sm:text-[15px]"
					)}
				>
					{label}
				</p>
				{children}
			</div>
			{isLoading ? (
				<Skeleton className="h-4 w-16 rounded" />
			) : (
				<MoneyDisplay
					{...moneyProps}
					className={cn(
						"text-price",
						compact ? "text-[14px] font-semibold min-[1025px]:text-[15px]" : "text-[14px] font-semibold sm:text-[15px]",
						moneyProps.money && className
					)}
				/>
			)}
		</div>
	);
};
