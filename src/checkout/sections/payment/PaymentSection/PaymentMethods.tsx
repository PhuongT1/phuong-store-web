import { useEffect } from "react";
import { RadioItem, RadioList } from "@ui";
import { useTranslations } from "next-intl";
import { FormProvider, useWatch } from "react-hook-form";
import { PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/payment/PaymentSection/usePayments";
import { useCheckoutTransactionStateStore } from "@/checkout/state/checkoutTransactionStateStore";
import { useCheckout } from "@hooks/checkout";
import { CashDeliveryComponent } from "./CashDelivery/cashDeliveryComponent";
import { cashDeliveryGatewayId } from "./CashDelivery/types";
import { paymentMethodToComponent } from "./supportedPaymentApps";
import { type PaymentGatewayId } from "./types";
import { usePaymentSectionForm } from "./usePaymentSectionForm";

export const PaymentMethods = () => {
	const t = useTranslations("checkout");
	const form = usePaymentSectionForm();
	const { actions } = useCheckoutTransactionStateStore();
	const selectedPayment = useWatch({ control: form.control, name: "paymentSectionSelectedId" });

	// Sync radio selection to zustand store so PayButton can read it
	useEffect(() => {
		if (selectedPayment) {
			actions.setPaymentSectionSelectedId(selectedPayment as PaymentGatewayId);
		}
	}, [selectedPayment, actions]);
	const { availablePaymentGateways, fetching } = usePayments();
	const { checkout } = useCheckout();

	if (fetching && availablePaymentGateways.length === 0) {
		return <PaymentSectionSkeleton />;
	}

	return (
		<div className="gap-y-8">
			<FormProvider {...form}>
				<RadioList name="paymentSectionSelectedId">
					<RadioItem
						variant={"border"}
						optionProps={{
							label: (
								<div className="flex flex-col gap-0.5">
									<span className="text-foreground text-sm font-semibold">
										{checkout?.availablePaymentGateways?.find((g) => g.id === cashDeliveryGatewayId)?.name ??
											t("cod")}
									</span>
									<CashDeliveryComponent />
								</div>
							),
							value: cashDeliveryGatewayId
						}}
					/>
					{availablePaymentGateways.map((gateway) => {
					const Component = paymentMethodToComponent[gateway.id as keyof typeof paymentMethodToComponent] as
						| React.ComponentType<{ config: typeof gateway }>
						| undefined;

						// Skip if payment gateway component not supported
						if (!Component) {
							console.warn(`Payment gateway ${gateway.id} is not supported in UI`);
							return null;
						}

						return (
							<RadioItem
								key={gateway.id}
								variant={"border"}
								optionProps={{
									label: (
										<div className="flex flex-col gap-0.5">
											<span className="text-foreground text-sm font-semibold">
												{checkout?.availablePaymentGateways?.find((g) => g.id === gateway.id)?.name || t("onlinePayment")}
											</span>
											{}
											<Component key={gateway.id} config={gateway} />
										</div>
									),
									value: gateway.id
								}}
							/>
						);
					})}
				</RadioList>
			</FormProvider>
		</div>
	);
};
