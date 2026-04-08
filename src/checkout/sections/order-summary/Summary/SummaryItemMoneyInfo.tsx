"use client";

import React from "react";
import { MoneyDisplay } from "@/components/ui";
import { type CheckoutLine, type Money, type OrderLine } from "@/gql/graphql";

type CheckoutLineProps = Pick<CheckoutLine, "totalPrice" | "undiscountedTotalPrice">;
type OrderLineProps = Pick<OrderLine, "quantity" | "unitPrice" | "undiscountedUnitPrice">;

export type SummaryItemMoneyInfoProps = CheckoutLineProps | OrderLineProps;

export const SummaryItemMoneyInfo: React.FC<SummaryItemMoneyInfoProps> = (props) => {
	let discountedTotal: Money;
	let originalTotal: Money;

	if ("undiscountedTotalPrice" in props) {
		// CheckoutLine: totalPrice and undiscountedTotalPrice are pre-multiplied by qty
		discountedTotal = props.totalPrice.gross;
		originalTotal = props.undiscountedTotalPrice;
	} else {
		// OrderLine: unitPrice and undiscountedUnitPrice are per-unit → multiply by qty
		const { quantity, unitPrice, undiscountedUnitPrice } = props;
		discountedTotal = { ...unitPrice.gross, amount: unitPrice.gross.amount * quantity };
		originalTotal = { ...undiscountedUnitPrice.gross, amount: undiscountedUnitPrice.gross.amount * quantity };
	}

	const isOnSale = originalTotal.amount > discountedTotal.amount;

	return (
		<div className="flex flex-col items-end">
			{isOnSale && (
				<MoneyDisplay money={originalTotal} className="text-muted-foreground text-xs line-through" />
			)}
			<MoneyDisplay aria-label="total price" money={discountedTotal} />
		</div>
	);
};
