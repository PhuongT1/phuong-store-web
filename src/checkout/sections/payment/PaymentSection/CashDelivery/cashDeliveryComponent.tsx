"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useMutation } from "@/checkout/lib/useMutation";
import { useCheckoutTransactionStateStore } from "@/checkout/state/checkoutTransactionStateStore";
import {
	TransactionInitializeDocument,
	type TransactionInitialize,
	type TransactionInitializeMutation,
	type TransactionInitializeMutationVariables
} from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";
import { apiErrorMessages } from "../errorMessages";
import { vnpayGatewayId } from "../VNPay/types";
import { cashDeliveryGatewayId } from "./types";

interface CashDeliveryComponentProps {
	active?: boolean;
}

export const CashDeliveryComponent = ({ active = false }: CashDeliveryComponentProps) => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();

	const [{ fetching, data }, transactionInitialize] = useMutation<
		TransactionInitializeMutation,
		TransactionInitializeMutationVariables
	>(TransactionInitializeDocument);

	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	const {
		transaction,
		actions: { setUpdateState }
	} = useCheckoutTransactionStateStore();
	const calledCheckoutIdRef = useRef<string | null>(null);

	const handleTransactionInitialize = useCallback(() => {
		if (!checkoutId) return;
		// Route through the VNPay payment app (id: vnpayGatewayId) which handles COD
		// internally by checking data.type === "cod" and returning CHARGE_SUCCESS.
		// Do NOT use cashDeliveryGatewayId as the gateway here — that ID belongs to a
		// separate Saleor app that does not implement the transactionProcess webhook
		// correctly for COD and would return AUTHORIZATION_FAILURE.
		transactionInitialize({
			checkoutId,
			paymentGatewayId: vnpayGatewayId,
			data: { type: "cod" }
		})
			.then((result) => {
				const tx = result.data?.transactionInitialize;
				if (!tx || result.error) {
					showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
					return;
				}
				setUpdateState({ [cashDeliveryGatewayId]: tx as TransactionInitialize });
			})
			.catch((err) => {
				console.error(err);
				showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
			});
	}, [
		checkoutId,
		transactionInitialize,
		setUpdateState,
		showCustomErrors,
		commonErrorMessages.somethingWentWrong
	]);

	useEffect(() => {
		// Only initialize COD transaction when the method is actively selected.
		if (!active || !checkoutId) return;
		if (fetching) return;
		if (transaction?.[cashDeliveryGatewayId]) return;
		if (calledCheckoutIdRef.current === checkoutId) return;
		calledCheckoutIdRef.current = checkoutId;
		handleTransactionInitialize();
	}, [
		active,
		checkoutId,
		transaction,
		fetching,
		handleTransactionInitialize,
		data
	]);

	return (
		<div className="text-muted-foreground/75 text-xs leading-relaxed">Nhận hàng rồi mới thanh toán.</div>
	);
};
