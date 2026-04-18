import { type FC } from "react";
import { useTranslations } from "next-intl";
import { PromoCodeAdd } from "@/checkout/sections/order-summary/Summary/PromoCodeAdd";
import { SummaryMoneyRow } from "@/checkout/sections/order-summary/Summary/SummaryMoneyRow";
import { SummaryPromoCodeRow } from "@/checkout/sections/order-summary/Summary/SummaryPromoCodeRow";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { type Checkout, type Money, type TaxedMoney } from "@/gql/graphql";
import { useCheckoutLines } from "@/hooks/checkout";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { MoneyDisplay, getFormattedMoney, Separator } from "@components/ui";
import { type CartLine } from "../Cart.type";
import { SummaryCard } from "./SummaryCard";

type SummaryProps = {
	editable?: boolean;
	lines: CartLine[];
	classNameCard?: string;
	compact?: boolean;
} & Omit<Checkout, "lines">;

const Summary: FC<SummaryProps> = ({
	editable = true,
	lines,
	classNameCard,
	compact = false,
	totalPrice,
	subtotalPrice,
	giftCards = [],
	voucherCode,
	shippingPrice,
	discount
}) => {
	const { isValidating } = useCheckout();
	const {
		updateCart: { isUpdating }
	} = useCheckoutLines();
	const isLoading = isValidating || isUpdating;
	const t = useTranslations("cart");

	if (!totalPrice) return null;

	const currency = totalPrice.gross?.currency ?? "";
	const totalQuantity = lines.reduce((acc, line) => acc + line.quantity, 0);
	const lineSavings = lines.reduce((acc, line) => {
		// CheckoutLine.undiscountedTotalPrice is Money (.amount); OrderLine is TaxedMoney (.gross.amount)
		// OrderLineFragment may not fetch this field — guard against undefined at runtime
		const undiscTotal = line.undiscountedTotalPrice as Money | TaxedMoney | undefined;
		if (!undiscTotal) return acc;
		const undiscountedAmount = "amount" in undiscTotal ? undiscTotal.amount : undiscTotal.gross.amount;
		const saving = undiscountedAmount - line.totalPrice.gross.amount;
		return saving > 0 ? acc + saving : acc;
	}, 0);
	const hasSavings = lineSavings > 0.001;
	const savingsMoney = hasSavings
		? {
				__typename: "Money" as const,
				currency,
				amount: lineSavings,
				fractionDigits: 2,
				fractionalAmount: Math.round(lineSavings * 100)
			}
		: null;

	return (
		<SummaryCard className={classNameCard}>
			{editable && (
				<>
					<PromoCodeAdd compact={compact} />
					<Separator />
				</>
			)}
				<div className="flex max-w-full flex-col gap-1 min-[1025px]:gap-0">
				<SummaryMoneyRow
					compact={compact}
					label={t("subtotal")}
					money={subtotalPrice?.gross}
					aria-label="subtotal price"
					isLoading={isLoading}
				/>
				{hasSavings && savingsMoney && (
					<SummaryMoneyRow
						compact={compact}
						label={t("savings")}
						money={savingsMoney}
						aria-label="savings"
						isLoading={isLoading}
						className="text-success font-medium"
						negative
					/>
				)}
				{voucherCode && (
					<SummaryPromoCodeRow
						compact={compact}
						editable={editable}
						promoCode={voucherCode}
						aria-label="voucher"
						label={voucherCode}
						money={discount}
						negative
					/>
				)}
				{giftCards.map(({ currentBalance, displayCode, id }) => (
					<SummaryPromoCodeRow
						compact={compact}
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
					compact={compact}
					label={t("shipping")}
					aria-label="shipping cost"
					money={shippingPrice?.gross}
					isLoading={isLoading}
				/>
					<Separator className="my-3.5 min-[1025px]:my-4" />
					<div className="flex flex-row items-baseline justify-between pb-1.5 min-[1025px]:pb-4">
						<div className="flex flex-row items-baseline gap-2">
							<p className="text-[15px] font-bold tracking-[-0.01em] min-[1025px]:text-base">{t("total")}</p>
							<span className="bg-secondary/42 text-muted-foreground rounded-full px-1.5 py-0.5 text-[11px] font-semibold min-[1025px]:px-2 min-[1025px]:text-[13px]">
								({totalQuantity})
							</span>
							<p color="secondary" className="text-muted-foreground hidden text-xs min-[1025px]:block">
								{t("taxIncluded", { tax: getFormattedMoney(totalPrice?.tax) })}
							</p>
						</div>
					{isLoading ? (
						<Skeleton className="h-6 w-24 rounded" />
					) : (
						<MoneyDisplay
							aria-label="total price"
							money={totalPrice?.gross}
							data-testid="totalOrderPrice"
							className="text-price text-[18px] font-bold tracking-[-0.02em] min-[1025px]:text-[20px]"
						/>
					)}
				</div>
			</div>
		</SummaryCard>
	);
};

export { Summary };
