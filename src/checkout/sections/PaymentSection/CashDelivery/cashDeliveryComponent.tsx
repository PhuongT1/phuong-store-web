"use client";

import { useCallback, useEffect } from "react";
import { useCheckout } from "@hooks/checkout";
import { apiErrorMessages } from "../errorMessages";
import { vnpayGatewayId } from "../VNPay/types";
import { cashDeliveryGatewayId } from "./types";
import { useTransactionCashDeliveryInitializeMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useCheckoutTransactionStateStore } from "@/checkout/state/checkoutTransactionStateStore";
import { useDebouncedSubmit } from "@/checkout/hooks/useDebouncedSubmit";

export const CashDeliveryComponent = () => {
	const {
		checkout: { id: checkoutId }
	} = useCheckout();

	const [{ fetching, data }, transactionInitialize] = useTransactionCashDeliveryInitializeMutation();

	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	const {
		actions: { setUpdateState }
	} = useCheckoutTransactionStateStore();

	const handleTransactionInitialize = useCallback(() => {
		if (!checkoutId) return;
		transactionInitialize({
			checkoutId,
			paymentGatewayId: vnpayGatewayId,
			data: { type: "cod" }
		})
			.then((transactionInitializeResult) => {
				setUpdateState({
					[cashDeliveryGatewayId]: transactionInitializeResult.data?.transactionInitialize
				});
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

	return <>Thanh toán khi nhận hàng</>;
};
