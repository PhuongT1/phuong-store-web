import {
	SummaryItemMoneyInfo,
	SummaryItemMoneyInfoProps
} from "@/checkout/sections/Summary/SummaryItemMoneyInfo";
import { type OrderLine } from "@/gql/graphql";

interface LineItemQuantitySelectorProps {
	line: OrderLine;
}

export const SummaryItemMoneySection: React.FC<LineItemQuantitySelectorProps> = ({ line }) => {
	return (
		<div className="flex flex-col items-end">
			<p>Số lượng: {line.quantity}</p>
			<SummaryItemMoneyInfo {...line} />
		</div>
	);
};
