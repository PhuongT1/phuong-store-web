import { type FC } from "react";
import { useTranslations } from "next-intl";
import { PromoCodeAdd } from "@/checkout/sections/order-summary/Summary/PromoCodeAdd";
import { SummaryMoneyRow } from "@/checkout/sections/order-summary/Summary/SummaryMoneyRow";
import { SummaryPromoCodeRow } from "@/checkout/sections/order-summary/Summary/SummaryPromoCodeRow";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { type Checkout } from "@/gql/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { cn } from "@/lib/utils";
import { MoneyDisplay, getFormattedMoney , Separator } from "@components/ui";
import { type CartLine } from "../Cart.type";
import { SummaryCard } from "./SummaryCard";

type SummaryProps = {
	editable?: boolean;
	lines: CartLine[];
	classNameCard?: string;
} & Checkout;

const Summary: FC<SummaryProps> = ({
	editable = true,
	totalPrice,
	subtotalPrice,
	giftCards = [],
	voucherCode,
	shippingPrice,
	discount
}) => {
	const { isValidating } = useCheckout();
	const t = useTranslations("cart");

	if (!totalPrice) return null;
	return (
		<SummaryCard>
			{editable && (
				<>
					<PromoCodeAdd />
					<Separator />
				</>
			)}
			<div className="flex max-w-full flex-col">
				<SummaryMoneyRow
					label={t("subtotal")}
					money={subtotalPrice?.gross}
					aria-label="subtotal price"
					isLoading={isValidating}
				/>
				{voucherCode && (
					<SummaryPromoCodeRow
						editable={editable}
						promoCode={voucherCode}
						aria-label="voucher"
						label={`${t("voucherCode")}: ${voucherCode}`}
						money={discount}
						negative
					/>
				)}
				{giftCards.map(({ currentBalance, displayCode, id }) => (
					<SummaryPromoCodeRow
						key={id}
						editable={editable}
						promoCodeId={id}
						aria-label="gift card"
						label={`Gift Card: •••• •••• ${displayCode}`}
						money={currentBalance}
						negative
					/>
				))}
				<SummaryMoneyRow
					label={t("shipping")}
					aria-label="shipping cost"
					money={shippingPrice?.gross}
					isLoading={isValidating}
				/>
				<Separator className="my-4" />
				<div className="flex flex-row items-baseline justify-between pb-4">
					<div className="flex flex-row items-baseline">
						<p className="font-bold">{t("total")}</p>
						<p color="secondary" className="ml-2">
							{t("taxIncluded", { tax: getFormattedMoney(totalPrice?.tax) })}
						</p>
					</div>
					{isValidating ? (
						<Skeleton className="h-6 w-24 rounded" />
					) : (
						<MoneyDisplay
							aria-label="total price"
							money={totalPrice?.gross}
							data-testid="totalOrderPrice"
							className="font-bold"
						/>
					)}
				</div>
			</div>
		</SummaryCard>
	);
};

export { Summary };
