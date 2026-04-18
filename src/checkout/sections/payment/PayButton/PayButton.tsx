import React from "react";
import { Lock, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { type AddressFormProps } from "@/checkout/components/AddressForm";
import { HostedPaymentModal } from "@/checkout/components/HostedPaymentModal";
import { OrderCreatingOverlay } from "@/checkout/components/OrderCreatingOverlay";
import { PaymentProcessingModal } from "@/checkout/components/PaymentProcessingModal";
import { type AddressFragment } from "@/gql/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { MoneyDisplay, Separator } from "@components/ui";
import { usePayButton } from "./usePayButton";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess?: (address: AddressFragment) => void;
	onClose?: () => void;
}

export const PayButton: React.FC<AddressCreateFormProps> = () => {
	const t = useTranslations("checkout");
	const { checkout } = useCheckout();
	const {
		isPolling,
		timeElapsed,
		showProcessingModal,
		checkoutUpdateState,
		handleClickOrder,
		handleCancelProcessing,
		isCreatingOrder,
		hostedPayment,
		hostedPaymentPresentation,
		handleHostedPaymentOpenChange,
		handleOpenHostedPaymentExternal
	} = usePayButton();

	return (
		<>
			{/* COD / fast-path loading overlay */}
			<OrderCreatingOverlay isOpen={isCreatingOrder} />

			{/* VNPay polling modal */}
			<PaymentProcessingModal
				isOpen={showProcessingModal}
				timeElapsed={timeElapsed}
				maxTime={60000}
				onCancel={handleCancelProcessing}
			/>

			<HostedPaymentModal
				isOpen={!!hostedPayment}
				url={hostedPayment?.url}
				gateway={hostedPaymentPresentation}
				onOpenChange={handleHostedPaymentOpenChange}
				onOpenExternal={handleOpenHostedPaymentExternal}
			/>

			<Separator className="my-4" />

			<div className="sticky bottom-[18px] z-20 mt-4 pb-[env(safe-area-inset-bottom)]">
				<div className="flex items-stretch gap-2">
					<button
						onClick={handleClickOrder}
						disabled={checkoutUpdateState.loadingCheckout || isPolling}
						className="group from-cta-from to-cta-to flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r px-4 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_12px_24px_rgba(50,86,192,0.20)] transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{checkoutUpdateState.loadingCheckout ? (
							<>
								<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
									<circle
										className="opacity-20"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="3"
									/>
									<path
										className="opacity-80"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									/>
								</svg>
								<span>Đang xử lý...</span>
							</>
						) : (
							<>
								<ShoppingBag className="h-4 w-4 shrink-0" />
								<span className="truncate">{t("placeOrder")}</span>
								<Lock className="h-3.5 w-3.5 shrink-0 text-white/60" />
							</>
						)}
					</button>

					<div className="bg-card/98 flex min-w-[148px] shrink-0 items-center justify-between gap-2 rounded-xl px-4 py-3 shadow-[0_14px_30px_rgba(15,23,42,0.16)] ring-1 ring-white/[0.05] sm:min-w-[160px] sm:px-4.5">
						<span className="text-muted-foreground text-[14px] font-semibold tracking-[0.01em]">Total</span>
						<MoneyDisplay
							money={checkout?.totalPrice?.gross}
							className="text-foreground text-[20px] font-bold whitespace-nowrap leading-none tracking-[-0.02em] sm:text-[22px]"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
