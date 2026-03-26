import { type FC } from "react";
import { MoneyDisplay, getFormattedMoney } from "@components/ui";
import { PromoCodeAdd } from "../../../checkout/sections/Summary/PromoCodeAdd";
import { SummaryMoneyRow } from "../../../checkout/sections/Summary/SummaryMoneyRow";
import { SummaryPromoCodeRow } from "../../../checkout/sections/Summary/SummaryPromoCodeRow";
import { type CartLine } from "../Cart.type";
import { SummaryCard } from "./SummaryCard";
import { Divider } from "@/checkout/components";
import { type Checkout } from "@/gql/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { cn } from "@/lib/utils";

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

	if (!totalPrice) return null;
	return (
		<SummaryCard>
			{editable && (
				<>
					<PromoCodeAdd />
					<Divider />
				</>
			)}
			<div className="flex max-w-full flex-col">
				<SummaryMoneyRow
					label="Tổng tiền"
					money={subtotalPrice?.gross}
					aria-label="subtotal price"
					className={cn(isValidating && "animate-pulse")}
				/>
				{voucherCode && (
					<SummaryPromoCodeRow
						editable={editable}
						promoCode={voucherCode}
						aria-label="voucher"
						label={`Mã giảm giá: ${voucherCode}`}
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
					label="Phí vận chuyển"
					aria-label="shipping cost"
					money={shippingPrice?.gross}
					className={cn(isValidating && "animate-pulse")}
				/>
				<Divider className="my-4" />
				<div className="flex flex-row items-baseline justify-between pb-4">
					<div className="flex flex-row items-baseline">
						<p className="font-bold">Cần thanh toán</p>
						<p color="secondary" className="ml-2">
							đã có {getFormattedMoney(totalPrice?.tax)} thuế
						</p>
					</div>
					<MoneyDisplay
						aria-label="total price"
						money={totalPrice?.gross}
						data-testid="totalOrderPrice"
						className={cn("font-bold", isValidating && "animate-pulse")}
					/>
				</div>
			</div>
		</SummaryCard>
	);
};

export { Summary };
