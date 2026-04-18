import { useEffect } from "react";
import { RadioItem, RadioList } from "@ui";
import { Banknote, BadgeHelp, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider, useWatch } from "react-hook-form";
import { PaymentSectionSkeleton } from "@/checkout/sections/payment/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/payment/PaymentSection/usePayments";
import { useCheckoutTransactionStateStore } from "@/checkout/state/checkoutTransactionStateStore";
import { useCheckout } from "@hooks/checkout";
import { CashDeliveryComponent } from "./CashDelivery/cashDeliveryComponent";
import { cashDeliveryGatewayId } from "./CashDelivery/types";
import { getHostedGatewayPresentation } from "./hostedGateways";
import { paymentMethodToComponent } from "./supportedPaymentApps";
import { type PaymentGatewayId } from "./types";
import { usePaymentSectionForm } from "./usePaymentSectionForm";

const BrandBadge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<div
		className={`inline-flex h-7 min-w-[70px] items-center justify-center rounded-xl border px-2 text-[10px] font-bold tracking-[0.08em] min-[1025px]:h-8 min-[1025px]:min-w-[74px] min-[1025px]:px-2.5 min-[1025px]:text-[11px] ${className ?? ""}`}
	>
		{children}
	</div>
);

const PaymentGatewayBadge = ({ gatewayId, name }: { gatewayId: string; name: string }) => {
	if (gatewayId === cashDeliveryGatewayId) {
		return (
			<div className="bg-secondary/42 flex h-7 min-w-7 items-center justify-center rounded-lg px-2 min-[1025px]:h-8 min-[1025px]:min-w-8">
				<Banknote className="text-info h-4 w-4" strokeWidth={1.7} />
			</div>
		);
	}

	if (gatewayId.includes("vnpay")) {
		const presentation = getHostedGatewayPresentation(gatewayId);
		return (
			<BrandBadge className="border-[#0F4FAF]/22 bg-white px-2.5 dark:border-[#4B8DFF]/20 dark:bg-white">
				<img
					src={presentation?.logoSrc}
					alt={presentation?.logoAlt ?? "VNPay"}
					className="h-4 w-auto object-contain min-[1025px]:h-[18px]"
				/>
			</BrandBadge>
		);
	}

	if (gatewayId.includes("stripe")) {
		return (
			<BrandBadge className="border-[#635BFF]/35 bg-[#635BFF]/10 text-[#635BFF] dark:border-[#8B86FF]/40 dark:bg-[#8B86FF]/14 dark:text-[#A39FFF]">
				STRIPE
			</BrandBadge>
		);
	}

	if (gatewayId.includes("adyen")) {
		return (
			<BrandBadge className="border-[#0B7D4F]/35 bg-[#0B7D4F]/12 text-[#0B7D4F] dark:border-[#3CC98F]/40 dark:bg-[#3CC98F]/14 dark:text-[#6EE7B7]">
				ADYEN
			</BrandBadge>
		);
	}

	return (
		<div className="bg-secondary/42 flex h-7 min-w-7 items-center justify-center rounded-lg px-2 min-[1025px]:h-8 min-[1025px]:min-w-8">
			{(name || "").toLowerCase().includes("card") ? (
				<CreditCard className="text-info h-4 w-4" strokeWidth={1.7} />
			) : (
				<BadgeHelp className="text-info h-4 w-4" strokeWidth={1.7} />
			)}
		</div>
	);
};

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
	const usablePaymentGateways = availablePaymentGateways.filter((gateway) => {
		const gatewayWithErrors = gateway as typeof gateway & { errors?: Array<{ message?: string | null }> | null };
		return !gatewayWithErrors.errors?.length;
	});
	const cashGateway = checkout?.availablePaymentGateways?.find((gateway) => gateway.id === cashDeliveryGatewayId);

	if (fetching && usablePaymentGateways.length === 0) {
		return <PaymentSectionSkeleton />;
	}

	// Count total gateways (cash + supported) to determine grid layout
	const totalGateways =
		(cashGateway ? 1 : 0) +
		usablePaymentGateways.filter(
			(g) => paymentMethodToComponent[g.id as keyof typeof paymentMethodToComponent]
		).length;

	const listClassName =
		totalGateways > 1
			? "grid-cols-1 gap-2.5 sm:grid-cols-2"
			: "grid-cols-1 gap-2.5";
	const paymentCardClassName =
		"rounded-xl border border-border/40 bg-card/72 p-3 shadow-none backdrop-blur-[2px] [&_button]:mt-0 [&_button]:h-[18px] [&_button]:w-[18px] min-[1025px]:rounded-2xl min-[1025px]:border-border/55 min-[1025px]:bg-card/96 min-[1025px]:p-4 min-[1025px]:shadow-sm";

	return (
		<FormProvider {...form}>
			<RadioList name="paymentSectionSelectedId" className={listClassName}>
				{cashGateway && (
					<RadioItem
						variant={"border"}
						divProps={{
							className: paymentCardClassName
						}}
						optionProps={{
							label: (
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-3">
										<PaymentGatewayBadge gatewayId={cashDeliveryGatewayId} name={cashGateway.name ?? t("cod")} />
										<span className="text-foreground text-[14px] font-semibold min-[1025px]:text-sm">
											{cashGateway.name ?? t("cod")}
										</span>
									</div>
									<CashDeliveryComponent active={selectedPayment === cashDeliveryGatewayId} />
								</div>
							),
							value: cashDeliveryGatewayId
						}}
					/>
				)}
				{usablePaymentGateways.map((gateway) => {
					const Component = paymentMethodToComponent[
						gateway.id as keyof typeof paymentMethodToComponent
					] as React.ComponentType<{ config: typeof gateway }> | undefined;

					if (!Component) {
						console.warn(`Payment gateway ${gateway.id} is not supported in UI`);
						return null;
					}

					return (
						<RadioItem
							key={gateway.id}
							variant={"border"}
							divProps={{
								className: paymentCardClassName
							}}
							optionProps={{
								label: (
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-3">
											<PaymentGatewayBadge
												gatewayId={gateway.id}
												name={
													checkout?.availablePaymentGateways?.find((g) => g.id === gateway.id)?.name ||
													t("onlinePayment")
												}
											/>
											<span className="text-foreground text-[14px] font-semibold min-[1025px]:text-sm">
												{checkout?.availablePaymentGateways?.find((g) => g.id === gateway.id)?.name ||
													t("onlinePayment")}
											</span>
										</div>
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
	);
};
