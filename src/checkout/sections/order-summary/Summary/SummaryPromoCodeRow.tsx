import React from "react";
import { X } from "lucide-react";
import { useMutation } from "@/checkout/lib/useMutation";
import { Button } from "@/components/ui/Button";
import { type CheckoutRemovePromoCodeMutation, type CheckoutRemovePromoCodeMutationVariables, CheckoutRemovePromoCodeDocument } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";
import { SummaryMoneyRow, type SummaryMoneyRowProps } from "./SummaryMoneyRow";

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
	const [, checkoutRemovePromoCode] = useMutation<CheckoutRemovePromoCodeMutation, CheckoutRemovePromoCodeMutationVariables>(CheckoutRemovePromoCodeDocument);

	const onDelete = () => {
		const variables = promoCode ? { promoCode: promoCode } : { promoCodeId: promoCodeId as string };

		void checkoutRemovePromoCode({
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
					<Button variant="ghost" size="icon" onClick={onDelete} aria-label="remove promo code">
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}
		</SummaryMoneyRow>
	);
};
