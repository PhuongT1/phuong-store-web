import React from "react";
import { BadgeX, TicketPercent } from "lucide-react";
import { useMutation } from "@/checkout/lib/useMutation";
import { MoneyDisplay } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { type CheckoutRemovePromoCodeMutation, type CheckoutRemovePromoCodeMutationVariables, CheckoutRemovePromoCodeDocument } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useCheckout } from "@hooks/checkout";
import { type SummaryMoneyRowProps } from "./SummaryMoneyRow";

interface SummaryPromoCodeRowProps extends SummaryMoneyRowProps {
	promoCode?: string;
	promoCodeId?: string;
	editable: boolean;
	compact?: boolean;
}

export const SummaryPromoCodeRow: React.FC<SummaryPromoCodeRowProps> = ({
	promoCode,
	promoCodeId,
	editable,
	compact = false,
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
		<div
			className={cn(
				"rounded-xl border border-info/18 bg-linear-to-r from-info/8 via-info/4 to-transparent",
				compact
					? "mb-1.5 px-1.5 py-1 min-[1025px]:mb-1.5 min-[1025px]:px-3 min-[1025px]:py-1.5"
					: "mb-1.5 px-2 py-1.5 sm:mb-1.5 sm:px-3"
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="min-w-0 flex flex-1 items-center gap-1.5">
					<p
						className={cn(
							"text-foreground/90 truncate font-medium",
							compact ? "text-[14px] min-[1025px]:text-[15px]" : "text-[14px] sm:text-[15px]"
						)}
					>
						{rest.label}
					</p>
					<span
						className={cn(
							"bg-info/12 text-info inline-flex shrink-0 items-center justify-center rounded-full",
							compact ? "h-5 w-5 min-[1025px]:h-7 min-[1025px]:w-7" : "h-6 w-6 sm:h-7 sm:w-7"
						)}
					>
						<TicketPercent
							className={cn(
								compact
									? "h-2.5 w-2.5 min-[1025px]:h-3.5 min-[1025px]:w-3.5"
									: "h-3 w-3 sm:h-3.5 sm:w-3.5"
							)}
						/>
					</span>
						{editable && (
							<Button
								variant="ghost"
								size="icon"
								onClick={onDelete}
								aria-label="remove promo code"
								className={cn(
									"text-destructive hover:bg-destructive-muted/55 hover:text-destructive shrink-0 rounded-full",
									compact ? "h-5 w-5 min-[1025px]:h-7 min-[1025px]:w-7" : "h-6 w-6 sm:h-7 sm:w-7"
								)}
							>
								<BadgeX
									className={cn(
										compact
											? "h-3 w-3 min-[1025px]:h-4 min-[1025px]:w-4"
											: "h-3.5 w-3.5 sm:h-4 sm:w-4"
									)}
								/>
							</Button>
						)}
				</div>
				<MoneyDisplay
					{...rest}
					className={cn(
						"text-price shrink-0 font-medium",
						compact ? "text-[14px] min-[1025px]:text-[15px]" : "text-[14px] sm:text-[15px]",
						rest.className
					)}
				/>
			</div>
		</div>
	);
};
