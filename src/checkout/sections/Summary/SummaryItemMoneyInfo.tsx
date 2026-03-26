"use client";

import React from "react";
import { type CheckoutLine, type OrderLine } from "@/gql/graphql";
import { MoneyDisplay } from "@/components/ui";

export type SummaryItemMoneyInfoProps = CheckoutLine | OrderLine;

export const SummaryItemMoneyInfo: React.FC<SummaryItemMoneyInfoProps> = ({ unitPrice, quantity }) => {
	const piecePrice = unitPrice.gross;

	return (
		<div className="flex items-end justify-end">
			<div className="flex flex-row flex-wrap items-center justify-end gap-x-2">
				<MoneyDisplay
					aria-label="total price"
					money={
						{
							currency: piecePrice?.currency,
							amount: (piecePrice?.amount || 0) * quantity
						} as any
					}
				/>
			</div>
		</div>
	);
};
