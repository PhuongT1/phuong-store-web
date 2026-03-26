import { MoneyInfo } from "../line-item/MoneyInfo";
import { type SummaryLineEditProps } from "./SummaryLineEdit";

type SummaryItemMoneyEditableSectionProps = {
	index?: number;
} & Pick<SummaryLineEditProps, "line">;

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	return (
		<div className="flex items-center gap-2">
			<MoneyInfo {...line} />
		</div>
	);
};
