import React from "react";
import { TicketPercent, X } from "lucide-react";
import { useMutation } from "@/checkout/lib/useMutation";
import { MoneyDisplay } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { type CheckoutRemovePromoCodeMutation, type CheckoutRemovePromoCodeMutationVariables, CheckoutRemovePromoCodeDocument } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";
import { type SummaryMoneyRowProps } from "./SummaryMoneyRow";

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
		<div className="mb-1.5 rounded-xl border border-info/18 bg-linear-to-r from-info/8 via-info/4 to-transparent px-3 py-1.5">
			<div className="flex items-center justify-between gap-3">
				<div className="min-w-0 flex flex-1 items-center gap-1.5">
					<p className="text-foreground/90 truncate text-sm font-medium sm:text-[15px]">{rest.label}</p>
					<span className="bg-info/12 text-info inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
						<TicketPercent className="h-3.5 w-3.5" />
					</span>
					{editable && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onDelete}
							aria-label="remove promo code"
							className="text-muted-foreground hover:text-foreground h-7 w-7 shrink-0"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
				<MoneyDisplay
					{...rest}
					className={cn("text-price shrink-0 text-sm font-medium sm:text-[15px]", rest.className)}
				/>
			</div>
		</div>
	);
};
