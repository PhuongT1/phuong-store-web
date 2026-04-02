import React from "react";
import { Button } from "@ui";
import { Lock, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { type AddressFormProps } from "@/checkout/components/AddressForm";
import { OrderCreatingOverlay } from "@/checkout/components/OrderCreatingOverlay";
import { PaymentProcessingModal } from "@/checkout/components/PaymentProcessingModal";
import { type AddressFragment } from "@/gql/graphql";
import { Separator } from "@components/ui";
import { usePayButton } from "./usePayButton";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess?: (address: AddressFragment) => void;
	onClose?: () => void;
}

export const PayButton: React.FC<AddressCreateFormProps> = () => {
	const t = useTranslations("checkout");
	const {
		isPolling,
		timeElapsed,
		showProcessingModal,
		setShowProcessingModal,
		setPollingEnabled,
		setLoadingCheckout,
		checkoutUpdateState,
		handleClickOrder,
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
				onCancel={() => {
					setPollingEnabled(false);
					setShowProcessingModal(false);
					setLoadingCheckout(false);
					window.location.href = "/account/orders";
				}}
			/>

			<Separator className="my-4" />

			<button
				onClick={handleClickOrder}
				disabled={checkoutUpdateState.loadingCheckout || isPolling}
				className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-(--radius) bg-linear-to-r from-cta-from to-cta-to py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{checkoutUpdateState.loadingCheckout ? (
					<>
						<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
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
						<ShoppingBag className="h-4 w-4" />
						<span>{t("placeOrder")}</span>
						<Lock className="absolute right-4 h-3.5 w-3.5 text-white/50" />
					</>
				)}
			</button>

			<p className="text-muted-foreground mt-2 text-center text-[11px]">
				Thanh toán được bảo mật bởi SSL
			</p>
		</>
	);
};
