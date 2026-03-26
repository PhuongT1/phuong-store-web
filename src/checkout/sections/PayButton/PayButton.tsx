import React from "react";
import { Button } from "@ui";
import { usePayButton } from "./usePayButton";
import { type AddressFormProps } from "@/checkout/components/AddressForm";
import { type AddressFragment } from "@/checkout/graphql";
import { PaymentProcessingModal } from "@/checkout/components/PaymentProcessingModal";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess?: (address: AddressFragment) => void;
	onClose?: () => void;
}

export const PayButton: React.FC<AddressCreateFormProps> = () => {
	const {
		isPolling,
		timeElapsed,
		showProcessingModal,
		setShowProcessingModal,
		setPollingEnabled,
		setLoadingCheckout,
		checkoutUpdateState,
		handleClickOrder
	} = usePayButton();

	return (
		<>
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

			<Button
				className="w-full"
				variant="default"
				size="lg"
				loading={checkoutUpdateState.loadingCheckout}
				disabled={isPolling}
				onClick={handleClickOrder}
			>
				Đặt hàng
			</Button>
		</>
	);
};

