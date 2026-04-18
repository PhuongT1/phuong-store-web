import { MoneyInfo } from "../line-item/MoneyInfo";
import { type SummaryLineEditProps } from "./SummaryLineEdit";

type SummaryItemMoneyEditableSectionProps = {
	index?: number;
	compact?: boolean;
} & Pick<SummaryLineEditProps, "line">;

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line, compact = false }) => {
	return (
		<div className="flex items-center gap-2">
			<MoneyInfo {...line} compact={compact} />
		</div>
	);
};
