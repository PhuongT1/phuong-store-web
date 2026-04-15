import React from "react";
import { Lock, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { type AddressFormProps } from "@/checkout/components/AddressForm";
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
		isCreatingOrder
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

			<Separator className="my-4" />

			<div className="sticky bottom-[18px] z-20 mt-3 pb-[env(safe-area-inset-bottom)]">
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

					<div className="bg-card/96 flex min-w-[122px] shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.10)] ring-1 ring-black/6 sm:min-w-[138px] sm:px-4">
						<span className="text-muted-foreground text-xs font-medium">Total</span>
						<MoneyDisplay
							money={checkout?.totalPrice?.gross}
							className="text-foreground text-sm font-bold whitespace-nowrap sm:text-base"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
