"use client";

import React from "react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { type CheckoutLine } from "@/gql/graphql";
import { MoneyDisplay } from "@components/ui";

type MoneyInfoBasic = Pick<CheckoutLine, "unitPrice" | "undiscountedUnitPrice">;
type MoneyInfoProps<T> = T & { isLoading?: boolean };

export const MoneyInfo = <T extends MoneyInfoBasic = MoneyInfoBasic>({
	unitPrice,
	undiscountedUnitPrice,
	isLoading
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
				<MoneyDisplay money={undiscountedUnitPrice} className="text-muted-foreground text-xs line-through" />
			)}
			<MoneyDisplay money={discounted} />
		</div>
	);
};
