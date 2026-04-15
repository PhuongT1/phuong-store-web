import React, { type ReactNode, useState, useCallback, useEffect, useMemo } from "react";
import { BarLoader } from "react-spinners";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { createSafeContext } from "@/checkout/providers/createSafeContext";

interface PaymentProcessingContextConsumerProps {
	setIsProcessingPayment: (processing: boolean) => void;
}

const [usePaymentProcessingScreen, Provider] = createSafeContext<PaymentProcessingContextConsumerProps>();

export const PaymentProcessingScreen = ({ children }: { children: ReactNode }) => {
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	useEffect(() => {
		const { processingPayment } = getQueryParams();
		setIsProcessingPayment(!!processingPayment);
	}, []);

	const handleSetProcessing = useCallback((processing: boolean) => {
		setIsProcessingPayment(processing);
	}, []);

	return (
		<Provider value={useMemo(() => ({ setIsProcessingPayment: handleSetProcessing }), [handleSetProcessing])}>
			{isProcessingPayment && (
				<div className="bg-background fixed inset-0 z-50 flex flex-col items-center">
					<div className="flex grow flex-col justify-center pb-40">
						{/* <Title>Almost done…</Title> */}
						<BarLoader width="100%" />
					</div>
				</div>
			)}
			{children}
		</Provider>
	);
};

export { usePaymentProcessingScreen };
