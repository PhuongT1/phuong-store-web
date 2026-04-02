"use client";

import { useCallback, useEffect } from "react";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useDebouncedSubmit } from "@/checkout/hooks/useDebouncedSubmit";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useMutation } from "@/checkout/lib/useMutation";
import { useCheckoutTransactionStateStore } from "@/checkout/state/checkoutTransactionStateStore";
import { TransactionInitializeDocument, type TransactionInitialize, type TransactionInitializeMutation, type TransactionInitializeMutationVariables } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";
import { apiErrorMessages } from "../errorMessages";
import { vnpayGatewayId } from "../VNPay/types";
import { cashDeliveryGatewayId } from "./types";

export const CashDeliveryComponent = () => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();

	const [{ fetching, data }, transactionInitialize] = useMutation<TransactionInitializeMutation, TransactionInitializeMutationVariables>(TransactionInitializeDocument);

	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	const {
		actions: { setUpdateState }
	} = useCheckoutTransactionStateStore();

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

	const debouncedSubmit = useDebouncedSubmit(handleTransactionInitialize);

	useEffect(() => {
		if (fetching || data) return;
		debouncedSubmit();
	}, [
		fetching,
		data,
		checkoutId,
		commonErrorMessages.somethingWentWrong,
		showCustomErrors,
		transactionInitialize,
		handleTransactionInitialize
	]);

	return (
		<div className="text-muted-foreground text-sm">
			<p>Thanh toán khi nhận hàng</p>
			<p className="text-muted-foreground/70 mt-1 text-xs">Nhận hàng rồi mới thanh toán</p>
		</div>
	);
};
