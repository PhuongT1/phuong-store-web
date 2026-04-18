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
		<div className="flex flex-col items-end gap-0.5">
			<p className="text-muted-foreground text-xs sm:text-sm">
				{t("quantity")}: <span className="text-foreground font-semibold">{line.quantity}</span>
			</p>
			<SummaryItemMoneyInfo {...line} />
		</div>
	);
};
