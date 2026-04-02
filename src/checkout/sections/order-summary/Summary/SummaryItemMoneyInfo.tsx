"use client";

import React from "react";
import { MoneyDisplay } from "@/components/ui";
import { type CheckoutLine, type Money, type OrderLine } from "@/gql/graphql";

export type SummaryItemMoneyInfoProps = CheckoutLine | OrderLine;

export const SummaryItemMoneyInfo: React.FC<SummaryItemMoneyInfoProps> = ({ unitPrice, quantity }) => {
	const piecePrice = unitPrice.gross;

	const totalMoney: Money = {
		__typename: "Money" as const,
		currency: piecePrice?.currency ?? "",
		amount: (piecePrice?.amount || 0) * quantity,
		fractionDigits: piecePrice?.fractionDigits ?? 0,
		fractionalAmount: Math.round(((piecePrice?.amount || 0) * quantity) * Math.pow(10, piecePrice?.fractionDigits ?? 0))
	};

	return (
		<div className="flex items-end justify-end">
			<div className="flex flex-row flex-wrap items-center justify-end gap-x-2">
				<MoneyDisplay aria-label="total price" money={totalMoney} />
			</div>
		</div>
	);
};
