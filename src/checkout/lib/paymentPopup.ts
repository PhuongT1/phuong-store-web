/**
 * Payment Popup Utility
 * Opens payment gateway (VNPay, MoMo) in popup window instead of redirect
 * Handles postMessage communication for payment result
 */

interface PaymentPopupOptions {
	url: string;
	width?: number;
	height?: number;
	/** Pass a pre-opened Window (opened before any await) to avoid Chrome popup blocking */
	existingWindow?: Window | null;
	onSuccess?: (data: any) => void;
	onError?: (error: any) => void;
	onClose?: () => void;
}

/** Opens a blank popup immediately at user-gesture time so Chrome doesn't block it.
 *  Writes a loading spinner so the user sees immediate feedback.
 *  Call this BEFORE any await, then pass the returned window to openPaymentPopup. */
export const preOpenPaymentPopup = (width = 800, height = 700): Window | null => {
	const left = window.screen.width / 2 - width / 2;
	const top = window.screen.height / 2 - height / 2;
	const features = [
		`width=${width}`,
		`height=${height}`,
		`left=${left}`,
		`top=${top}`,
		"resizable=yes",
		"scrollbars=yes",
		"status=yes",
		"toolbar=no",
		"menubar=no",
		"location=no"
	].join(",");
	const popup = window.open("about:blank", "VNPayPayment", features);
	if (popup) {
		popup.document.write(`<!DOCTYPE html><html><head><title>Đang xử lý...</title>
<style>
:root{--bg:#f8f9fa;--track:#e5e7eb;--spin:#3b82f6;--text:#6b7280}
@media(prefers-color-scheme:dark){:root{--bg:#0d0f14;--track:#2d3548;--spin:#38bdf8;--text:#8892a4}}
body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--bg);font-family:system-ui,sans-serif}
.loader{text-align:center}.spinner{width:48px;height:48px;border:4px solid var(--track);border-top-color:var(--spin);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px}
@keyframes spin{to{transform:rotate(360deg)}}p{color:var(--text);font-size:15px}
</style></head>
<body><div class="loader"><div class="spinner"></div><p>Đang kết nối VNPay...</p></div></body></html>`);
		popup.document.close();
	}
	return popup;
};

export class PaymentPopup {
	private popup: Window | null = null;
	private checkInterval: NodeJS.Timeout | null = null;
	private messageListener: ((event: MessageEvent) => void) | null = null;

	open(options: PaymentPopupOptions): void {
		const { url, width = 800, height = 600, existingWindow, onSuccess, onError, onClose } = options;

		if (existingWindow && !existingWindow.closed) {
			// Reuse pre-opened window — preserves user-gesture origin
			this.popup = existingWindow;
			try {
				existingWindow.location.href = url;
			} catch {
				// Cross-origin navigation may throw; the page will still navigate
			}
		} else {
			// Fallback: open normally (works on second click when state is already set)
			const left = window.screen.width / 2 - width / 2;
			const top = window.screen.height / 2 - height / 2;
			const features = [
				`width=${width}`,
				`height=${height}`,
				`left=${left}`,
				`top=${top}`,
				"resizable=yes",
				"scrollbars=yes",
				"status=yes",
				"toolbar=no",
				"menubar=no",
				"location=no"
			].join(",");
			this.popup = window.open(url, "VNPayPayment", features);
		}

		if (!this.popup) {
			onError?.({ message: "Popup blocked. Please allow popups for this site." });
			return;
		}

		// Check if popup was closed manually
		this.checkInterval = setInterval(() => {
			if (this.popup && this.popup.closed) {
				this.cleanup();
				onClose?.();
			}
		}, 500);

		// Listen for postMessage from payment gateway return page
		this.messageListener = (event: MessageEvent) => {
			// Security: Verify origin if needed
			// if (event.origin !== expectedOrigin) return;

			const { type, data } = event.data;

			if (type === "PAYMENT_SUCCESS") {
				this.cleanup();
				onSuccess?.(data);
			} else if (type === "PAYMENT_ERROR" || type === "PAYMENT_CANCELLED") {
				console.warn("⚠️ Payment failed via popup:", data);
				this.cleanup();
				onError?.(data);
			}
		};

		window.addEventListener("message", this.messageListener);

		// Focus popup
		this.popup.focus();
	}

	close(): void {
		this.cleanup();
	}

	private cleanup(): void {
		if (this.popup && !this.popup.closed) {
			this.popup.close();
		}
		this.popup = null;

		if (this.checkInterval) {
			clearInterval(this.checkInterval);
			this.checkInterval = null;
		}

		if (this.messageListener) {
			window.removeEventListener("message", this.messageListener);
			this.messageListener = null;
		}
	}
}

// Singleton instance
let popupInstance: PaymentPopup | null = null;

export const openPaymentPopup = (options: PaymentPopupOptions): void => {
	// Close existing popup if any
	if (popupInstance) {
		popupInstance.close();
	}

	popupInstance = new PaymentPopup();
	popupInstance.open(options);
};

export const closePaymentPopup = (): void => {
	if (popupInstance) {
		popupInstance.close();
		popupInstance = null;
	}
};
