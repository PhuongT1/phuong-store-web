"use client";

import React from "react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { type CheckoutLine } from "@/gql/graphql";
import { MoneyDisplay } from "@components/ui";

type MoneyInfoBasic = Pick<CheckoutLine, "unitPrice" | "undiscountedUnitPrice">;
type MoneyInfoProps<T> = T & { isLoading?: boolean; compact?: boolean };

export const MoneyInfo = <T extends MoneyInfoBasic = MoneyInfoBasic>({
	unitPrice,
	undiscountedUnitPrice,
	isLoading,
	compact = false
}: MoneyInfoProps<T>) => {
	if (isLoading) {
		return (
			<div className="flex flex-col items-end gap-1">
				<Skeleton className="h-4 w-16 rounded" />
			</div>
		);
	}

	const discounted = unitPrice.gross;
	const isOnSale = undiscountedUnitPrice.amount > discounted.amount;

	return (
		<div className="flex flex-col items-end">
			{isOnSale && (
				<MoneyDisplay
					money={undiscountedUnitPrice}
					className={compact ? "text-muted-foreground text-[10px] line-through min-[1025px]:text-xs" : "text-muted-foreground text-[11px] line-through sm:text-xs"}
				/>
			)}
			<MoneyDisplay
				money={discounted}
				className={compact ? "text-price text-[13px] font-semibold min-[1025px]:text-base" : "text-price text-sm font-semibold sm:text-base"}
			/>
		</div>
	);
};
