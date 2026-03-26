import React from "react";
import { useCheckout } from "@hooks/checkout";
import { SummaryMoneyRow, type SummaryMoneyRowProps } from "./SummaryMoneyRow";
import { IconButton } from "@/checkout/components/IconButton";
import { RemoveIcon } from "@/checkout/ui-kit/icons";
import { useCheckoutRemovePromoCodeMutation } from "@/checkout/graphql";
import { LANGUAGE_CODE_DEFAULT } from "@/constants";

interface SummaryPromoCodeRowProps extends SummaryMoneyRowProps {
	promoCode?: string;
	promoCodeId?: string;
	editable: boolean;
}

export const SummaryPromoCodeRow: React.FC<SummaryPromoCodeRowProps> = ({
	promoCode,
	promoCodeId,
	editable,
	...rest
}) => {
	const { checkout, mutate } = useCheckout();
	const [, checkoutRemovePromoCode] = useCheckoutRemovePromoCodeMutation();

	const onDelete = () => {
		const variables = promoCode ? { promoCode: promoCode } : { promoCodeId: promoCodeId as string };

		void checkoutRemovePromoCode({
			languageCode: LANGUAGE_CODE_DEFAULT,
			checkoutId: checkout.id,
			...variables
		}).then(() => {
			void mutate();
		});
	};

	return (
		<SummaryMoneyRow {...rest}>
			{editable && (
				<div>
					<IconButton onClick={onDelete} ariaLabel="remove promo code" icon={<RemoveIcon aria-hidden />} />
				</div>
			)}
		</SummaryMoneyRow>
	);
};
