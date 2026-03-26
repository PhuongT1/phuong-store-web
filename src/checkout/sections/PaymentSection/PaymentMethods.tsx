 

import { useEffect } from "react";
import { useCheckout } from "@hooks/checkout";
import { RadioItem, RadioList } from "@ui";
import { FormProvider, useWatch } from "react-hook-form";
import { type ParsedPaymentGateway , type PaymentGatewayId } from "./types";
import { CashDeliveryComponent } from "./CashDelivery/cashDeliveryComponent";
import { usePaymentSectionForm } from "./usePaymentSectionForm";
import { cashDeliveryGatewayId } from "./CashDelivery/types";
import { paymentMethodToComponent } from "./supportedPaymentApps";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/PaymentSection/usePayments";
import { useCheckoutTransactionStateStore } from "@/checkout/state/checkoutTransactionStateStore";

export const PaymentMethods = () => {
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
								<div className="flex flex-col">
									<span className="text-sm font-semibold">
										{checkout?.availablePaymentGateways?.find((g) => g.id === cashDeliveryGatewayId)?.name ??
											"Thanh toán khi nhận hàng (COD)"}
									</span>
									<CashDeliveryComponent />
								</div>
							),
							value: cashDeliveryGatewayId
						}}
					/>
					{availablePaymentGateways.map((gateway: ParsedPaymentGateway<any, any>) => {
						 
						const Component = paymentMethodToComponent[gateway.id as keyof typeof paymentMethodToComponent];
						const name = checkout?.availablePaymentGateways?.find((g) => g.id === gateway.id)?.name;

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
										<div className="flex flex-col gap-1">
											<span className="text-sm font-semibold">{name || "Thanh toán trực tuyến"}</span>
											{ }
											<Component key={gateway.id} config={gateway as any} />
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
