import { useTranslations } from "next-intl";
import {
	SummaryItemMoneyInfo,
	SummaryItemMoneyInfoProps
} from "@/checkout/sections/order-summary/Summary/SummaryItemMoneyInfo";
import { type OrderLine } from "@/gql/graphql";

interface LineItemQuantitySelectorProps {
	line: OrderLine;
}

export const SummaryItemMoneySection: React.FC<LineItemQuantitySelectorProps> = ({ line }) => {
	const t = useTranslations("checkout");
	return (
		<div className="flex flex-col items-end">
			<p>{t("quantity")}: {line.quantity}</p>
			<SummaryItemMoneyInfo {...line} />
		</div>
	);
};
