import { useEffect, useMemo, useRef, useState } from "react";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { useMutation } from "@/checkout/lib/useMutation";
import { type ParsedPaymentGateways } from "@/checkout/sections/payment/PaymentSection/types";
import { getFilteredPaymentGateways } from "@/checkout/sections/payment/PaymentSection/utils";
import { type PaymentGatewaysInitializeMutation, type PaymentGatewaysInitializeMutationVariables, PaymentGatewaysInitializeDocument } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";

export const usePaymentGatewaysInitialize = () => {
	const {
		checkout: { id: checkoutId, availablePaymentGateways }
	} = useCheckout();

	const [gatewayConfigs, setGatewayConfigs] = useState<ParsedPaymentGateways>([]);
	// Prevent duplicate calls — the mutation is idempotent but calling it
	// twice wastes a network round-trip.
	const calledRef = useRef(false);

	const [{ fetching }, paymentGatewaysInitialize] = useMutation<PaymentGatewaysInitializeMutation, PaymentGatewaysInitializeMutationVariables>(PaymentGatewaysInitializeDocument);

	const onSubmit = useSubmit<{}, typeof paymentGatewaysInitialize>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "paymentGatewaysInitialize",
				shouldAbort: () => !availablePaymentGateways?.length,
				onSubmit: paymentGatewaysInitialize,
				parse: () => ({
					checkoutId,
					paymentGateways: getFilteredPaymentGateways(availablePaymentGateways).map(({ id }) => ({
						id,
						data: {} // webhook doesn't use this data, don't send GatewayConfigLine[]
					}))
				}),
				onSuccess: ({ data }) => {
					const parsedConfigs = (data.gatewayConfigs || []) as ParsedPaymentGateways;
					if (parsedConfigs.length > 0) {
						setGatewayConfigs(parsedConfigs);
					}
				},
				onError: ({ errors }) => {
					// Non-critical: fallback gateways already ensure VNPay is shown.
					// Use warn (not error) to avoid triggering Next.js dev error overlay.
					console.warn("[paymentGatewayInit] mutation error (using fallback):", errors);
				}
			}),
			[availablePaymentGateways, checkoutId, paymentGatewaysInitialize]
		)
	);

	const gatewayCount = availablePaymentGateways?.length ?? 0;
	useEffect(() => {
		if (gatewayCount > 0 && !calledRef.current) {
			calledRef.current = true;
			void onSubmit();
		}
	}, [gatewayCount]);  

	// Fallback: if mutation hasn't returned configs yet (or returned empty),
	// build synthetic gateway list directly from checkout.availablePaymentGateways.
	// This ensures VNPay appears immediately after checkout loads, regardless of
	// whether the paymentGatewayInitialize mutation succeeds.
	// VNPayComponent doesn't use gateway.data so empty data is fine.
	const fallbackGateways = useMemo(
		() =>
			getFilteredPaymentGateways(availablePaymentGateways).map(({ id }) => ({
				id,
				data: {} as Record<string, never>,
				errors: null
			})) as unknown as ParsedPaymentGateways,
		[availablePaymentGateways]
	);

	// Prefer mutation results (required for Adyen/Stripe initialization data),
	// fall back to checkout data when mutation hasn't run or returned empty.
	const resolvedGateways = gatewayConfigs.length > 0 ? gatewayConfigs : fallbackGateways;

	return {
		fetching,
		availablePaymentGateways: resolvedGateways
	};
};
