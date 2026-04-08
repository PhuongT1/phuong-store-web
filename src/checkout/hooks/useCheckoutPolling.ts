/**
 * Hook to poll checkout status after payment
 * Waits for VNPay IPN webhook to create order
 *
 * Pattern based on: Shopee, Lazada, Stripe
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useCheckout } from "@hooks/checkout";

interface CheckoutPollingOptions {
	enabled: boolean;
	checkoutId: string;
	transactionId?: string;
	interval?: number; // ms between polls (default: 2000)
	timeout?: number; // max time to poll (default: 60000)
	onOrderCreated?: (orderId: string) => void;
	onTimeout?: () => void;
	onError?: (error: Error) => void;
}

export const useCheckoutPolling = (options: CheckoutPollingOptions) => {
	const {
		enabled,
		checkoutId,
		transactionId,
		interval = 2000,
		timeout = 60000,
		onOrderCreated,
		onTimeout,
		onError
	} = options;

	const [isPolling, setIsPolling] = useState(false);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [lastCheckStatus, setLastCheckStatus] = useState<"checking" | "waiting" | "timeout" | "success">(
		"waiting"
	);

	const { mutate } = useCheckout();

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(0);
	// Require 2 consecutive null responses before treating checkout as gone.
	// A single {checkout: null} can be a transient auth race (Saleor hides
	// user-owned checkouts from unauthenticated requests). Two in a row strongly
	// indicates the checkout was genuinely converted to an order.
	const consecutiveNullCount = useRef(0);

	const stopPolling = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsPolling(false);
	}, []);

	const checkOrderStatus = useCallback(async () => {
		try {
			setLastCheckStatus("checking");

			const result = await mutate();

			// Check if checkout still exists.
			// If checkout is gone, it means it was converted to an order.
			// Guard: require 2 consecutive nulls because a single {checkout: null}
			// can be a transient auth race condition (Saleor returns null for
			// user-owned checkouts when the access token momentarily expires).
			if (!result?.checkout) {
				consecutiveNullCount.current++;
				if (consecutiveNullCount.current < 2) {
					// First null — might be transient. Wait for next poll to confirm.
					setLastCheckStatus("waiting");
					return;
				}
				stopPolling();
				setLastCheckStatus("success");
				consecutiveNullCount.current = 0;

				// Get order ID from URL or localStorage if available
				const orderId = sessionStorage.getItem(`order_for_checkout_${checkoutId}`);
				if (orderId) {
					onOrderCreated?.(orderId);
				} else {
					// Order created but we don't have ID - redirect to orders page
					onOrderCreated?.("unknown");
				}
				return;
			}

			// Checkout still exists — reset null counter and keep waiting for payment
			consecutiveNullCount.current = 0;
			setLastCheckStatus("waiting");
		} catch (error) {
			console.warn("⚠️ Error polling checkout:", error);
			setLastCheckStatus("waiting");
			onError?.(error as Error);
		}
	}, [checkoutId, transactionId, timeElapsed, mutate, stopPolling, onOrderCreated, onError]);

	useEffect(() => {
		if (!enabled || !checkoutId) {
			stopPolling();
			return;
		}

		setIsPolling(true);
		startTimeRef.current = Date.now();
		setTimeElapsed(0);
		consecutiveNullCount.current = 0;

		// Immediate first check
		void checkOrderStatus();

		// Set up polling interval
		intervalRef.current = setInterval(() => {
			const elapsed = Date.now() - (startTimeRef.current || 0);
			setTimeElapsed(elapsed);

			// Check timeout
			if (elapsed >= timeout) {
				console.warn("⏱️ Polling timeout reached");
				stopPolling();
				setLastCheckStatus("timeout");
				onTimeout?.();
				return;
			}

			// Poll for status
			void checkOrderStatus();
		}, interval);

		return () => {
			stopPolling();
		};
	}, [enabled, checkoutId, interval, timeout, checkOrderStatus, stopPolling, onTimeout]);

	return {
		isPolling,
		timeElapsed,
		status: lastCheckStatus,
		stopPolling
	};
};
