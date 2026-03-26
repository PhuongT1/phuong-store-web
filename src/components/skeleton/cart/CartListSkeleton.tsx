import React from "react";
import { SummaryCard } from "@components/cart/summary/SummaryCard";
import { CartLineSkeleton } from "./CartLineSkeleton";

const CartListSkeleton = () => {
	return (
		<SummaryCard>
			<ul>
				{Array.from({ length: 2 }).map((_, index) => (
					<CartLineSkeleton key={index} />
				))}
			</ul>
		</SummaryCard>
	);
};
CartListSkeleton.displayName = "CartListSkeleton";

export { CartListSkeleton };
