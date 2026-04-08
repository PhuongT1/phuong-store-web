import { useCheckoutLines } from "@/hooks/checkout";
import { MoneyInfo } from "../line-item/MoneyInfo";
import { type SummaryLineEditProps } from "./SummaryLineEdit";

type SummaryItemMoneyEditableSectionProps = {
	index?: number;
} & Pick<SummaryLineEditProps, "line">;

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const {
		updateCart: { isUpdating }
	} = useCheckoutLines();
	return (
		<div className="flex items-center gap-2">
			<MoneyInfo {...line} isLoading={isUpdating} />
		</div>
	);
};
