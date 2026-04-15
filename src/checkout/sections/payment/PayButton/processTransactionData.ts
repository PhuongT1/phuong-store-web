import { openPaymentPopup } from "@/checkout/lib/paymentPopup";
import { type TransactionInitialize } from "@/gql/graphql";

export type TxData = NonNullable<TransactionInitialize>;

export const getPaymentUrl = (data: Record<string, unknown> | null | undefined): string | undefined => {
	if (!data) return undefined;
	const url = data["paymentUrl"] ?? data["payment_url"];
	return typeof url === "string" ? url : undefined;
};

interface ProcessOptions {
	preOpenedWindow: Window | null | undefined;
	onSetTransactionId: (id: string) => void;
	onTrigger: (args: { id: string; data?: unknown }) => void;
	onActionRequired?: (transactionId: string) => void;
	/** Called when transactionInitialize already returned a terminal success event — skips transactionProcess and goes straight to checkoutComplete */
	onComplete: () => void;
	onLoadingEnd: () => void;
	onResetRetryState?: () => void;
}

export const processTransactionData = (txData: TxData, opts: ProcessOptions): void => {
	const { preOpenedWindow, onSetTransactionId, onTrigger, onActionRequired, onComplete, onLoadingEnd, onResetRetryState } = opts;

	const closePopup = () => {
		if (preOpenedWindow && !preOpenedWindow.closed) preOpenedWindow.close();
	};

	const showError = (msg: string) => void import("sonner").then(({ toast }) => toast.error(msg));

	if (txData.errors?.length) {
		closePopup();
		onResetRetryState?.();
		showError(`Lỗi khởi tạo thanh toán: ${txData.errors.map((e) => e.message ?? e.code).join(", ")}`);
		onLoadingEnd();
		return;
	}

	const txId = txData.transaction?.id;
	if (!txId) {
		closePopup();
		onResetRetryState?.();
		showError(txData.transactionEvent?.message ?? "Không thể khởi tạo giao dịch. Vui lòng thử lại.");
		onLoadingEnd();
		return;
	}

	const needsAction =
		txData.transactionEvent?.type === "CHARGE_ACTION_REQUIRED" ||
		txData.transactionEvent?.type === "AUTHORIZATION_ACTION_REQUIRED";

	if (needsAction) {
		const paymentUrl = getPaymentUrl(txData.data as Record<string, unknown> | null | undefined);
		if (paymentUrl) {
			onSetTransactionId(txId);
			openPaymentPopup({
				url: paymentUrl,
				width: 800,
				height: 700,
				existingWindow: preOpenedWindow,
				onSuccess: (data) => {
					// Start polling only after user actually finishes/returns from VNPay.
					// This avoids needless API polling while popup is still open.
					onActionRequired?.(txId);
					onTrigger({ id: txId, data: { vnpParams: "vnpParams" in data ? data.vnpParams : data } });
				},
				onError: (error) => {
					onResetRetryState?.();
					onLoadingEnd();
					showError(
						error?.errorMessage || error?.message || "Thanh toán không thành công. Vui lòng thử lại."
					);
				},
				onClose: () => {
					onResetRetryState?.();
					onLoadingEnd();
				}
			});
			return;
		}
		closePopup();
		onResetRetryState?.();
		onLoadingEnd();
		showError("Không nhận được URL thanh toán từ VNPay. Vui lòng thử lại.");
		return;
	}

	// Per Saleor docs: transactionProcess must ONLY be called when transactionInitialize
	// returned ACTION_REQUIRED. For all other event types, proceed to checkoutComplete.
	const eventType = txData.transactionEvent?.type;

	closePopup();

	// Explicit payment failure — show error, do not complete checkout.
	if (eventType === "CHARGE_FAILURE" || eventType === "AUTHORIZATION_FAILURE") {
		onResetRetryState?.();
		showError(txData.transactionEvent?.message ?? "Thanh toán không thành công. Vui lòng thử lại.");
		onLoadingEnd();
		return;
	}

	// Terminal success, pending (CHARGE_REQUEST / AUTHORIZATION_REQUEST), or no event
	// → proceed to checkoutComplete. Async apps will confirm via transactionEventReport.
	onComplete();
};
