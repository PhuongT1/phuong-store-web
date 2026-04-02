"use client";

import { useEffect, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useMutation } from "@/checkout/lib/useMutation";
import { type TransactionInitializeFullMutation, type TransactionInitializeFullMutationVariables, TransactionInitializeFullDocument } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";
import { apiErrorMessages } from "../errorMessages";
import { CheckoutForm } from "./stripeElementsForm";
import { stripeGatewayId } from "./types";

export const StripeComponent = () => {
	const { checkout } = useCheckout();

	const [transactionInitializeResult, transactionInitialize] = useMutation<TransactionInitializeFullMutation, TransactionInitializeFullMutationVariables>(TransactionInitializeFullDocument);
	const stripeData = transactionInitializeResult.data?.transactionInitialize?.data as
		| undefined
		| {
				paymentIntent: {
					client_secret: string;
				};
				publishableKey: string;
		  };

	const { showCustomErrors } = useAlerts();
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);

	useEffect(() => {
		transactionInitialize({
			checkoutId: checkout.id,
			paymentGateway: {
				id: stripeGatewayId,
				data: {
					automatic_payment_methods: {
						enabled: true
					}
				}
			}
		}).catch((err) => {
			console.error(err);
			showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
		});
	}, [checkout.id, commonErrorMessages.somethingWentWrong, showCustomErrors, transactionInitialize]);

	const stripePromise = useMemo(
		() => stripeData?.publishableKey && loadStripe(stripeData.publishableKey),
		[stripeData]
	);

	if (!stripePromise || !stripeData) {
		return null;
	}

	return (
		<Elements
			options={{ clientSecret: stripeData.paymentIntent.client_secret, appearance: { theme: "stripe" } }}
			stripe={stripePromise}
		>
			<CheckoutForm />
		</Elements>
	);
};
