import { type TransactionInitializeResult } from "@/checkout/graphql";
import { openPaymentPopup } from "@/checkout/lib/paymentPopup";

export type TxData = NonNullable<TransactionInitializeResult>;

export const getPaymentUrl = (data: Record<string, unknown> | null | undefined): string | undefined => {
	if (!data) return undefined;
	const url = data["paymentUrl"] ?? data["payment_url"];
	return typeof url === "string" ? url : undefined;
};

interface ProcessOptions {
	preOpenedWindow: Window | null | undefined;
	onSetTransactionId: (id: string) => void;
	onTrigger: (args: { id: string; data?: unknown }) => void;
	onLoadingEnd: () => void;
}

export const processTransactionData = (txData: TxData, opts: ProcessOptions): void => {
	const { preOpenedWindow, onSetTransactionId, onTrigger, onLoadingEnd } = opts;

	const closePopup = () => {
		if (preOpenedWindow && !preOpenedWindow.closed) preOpenedWindow.close();
	};

	const showError = (msg: string) => void import("sonner").then(({ toast }) => toast.error(msg));

	if (txData.errors?.length) {
		closePopup();
		showError(`Lỗi khởi tạo thanh toán: ${txData.errors.map((e) => e.message ?? e.code).join(", ")}`);
		onLoadingEnd();
		return;
	}

	const txId = txData.transaction?.id;
	if (!txId) {
		closePopup();
		showError(txData.transactionEvent?.message ?? "Không thể khởi tạo giao dịch. Vui lòng thử lại.");
		onLoadingEnd();
		return;
	}

	const needsAction =
		txData.transactionEvent?.type === "CHARGE_ACTION_REQUIRED" ||
		txData.transactionEvent?.type === "AUTHORIZATION_ACTION_REQUIRED";

	if (needsAction) {
		const paymentUrl = getPaymentUrl(txData.data);
		if (paymentUrl) {
			onSetTransactionId(txId);
			openPaymentPopup({
				url: paymentUrl,
				width: 800,
				height: 700,
				existingWindow: preOpenedWindow,
				onSuccess: (data) => {
					onTrigger({ id: txId, data: { vnpParams: "vnpParams" in data ? data.vnpParams : data } });
				},
				onError: () => {
					onLoadingEnd();
					showError("Thanh toán không thành công. Vui lòng thử lại.");
				},
				onClose: () => onLoadingEnd()
			});
			return;
		}
		closePopup();
		onLoadingEnd();
		showError("Không nhận được URL thanh toán từ VNPay. Vui lòng thử lại.");
		return;
	}

	// COD / no action required
	closePopup();
	onTrigger({ id: txId });
};
