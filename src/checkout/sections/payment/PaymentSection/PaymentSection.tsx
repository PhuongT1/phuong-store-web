import React from "react";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator, Typography } from "@/components/ui";
import { PaymentMethods } from "./PaymentMethods";

export const PaymentSection = () => {
	const t = useTranslations("checkout");
	return (
		<>
			<Separator />
			<div className="py-4" data-testid="paymentMethods">
				<div className="mb-3 flex items-center gap-2.5">
					<div className="bg-icon-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-(--radius)">
						<Wallet className="text-info h-3.5 w-3.5" strokeWidth={1.5} />
					</div>
					<Typography variant="section-label" className="mb-0!">
						{t("paymentMethod")}
					</Typography>
				</div>
				<PaymentMethods />
			</div>
		</>
	);
};
