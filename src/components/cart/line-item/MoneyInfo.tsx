"use client";

import React from "react";
import { clsx } from "clsx";
import { type CheckoutLine } from "@/gql/graphql";
import { MoneyDisplay } from "@components/ui";

type MoneyInfoBasic = Pick<CheckoutLine, "unitPrice" | "quantity">;
type MoneyInfoProps<T> = T;

export const MoneyInfo = <T extends MoneyInfoBasic = MoneyInfoBasic>({
	unitPrice,
	quantity
}: MoneyInfoProps<T>) => {
	const piecePrice = unitPrice.gross;
	const onSale = false;

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
					className={clsx({
						"!text-text-error": onSale
					})}
				/>
			</div>
		</div>
	);
};
