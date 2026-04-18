import { type TransactionInitialize } from "@/gql/graphql";

export type TxData = NonNullable<TransactionInitialize>;

export const getPaymentUrl = (data: Record<string, unknown> | null | undefined): string | undefined => {
	if (!data) return undefined;
	const url = data["paymentUrl"] ?? data["payment_url"];
	return typeof url === "string" ? url : undefined;
};

interface ProcessOptions {
	onSetTransactionId: (id: string) => void;
	onActionRequired?: (args: { transactionId: string; paymentUrl: string }) => void;
	isFlowActive?: () => boolean;
	/** Called when transactionInitialize already returned a terminal success event — skips transactionProcess and goes straight to checkoutComplete */
	onComplete: () => void;
	onLoadingEnd: () => void;
	onResetRetryState?: () => void;
}

export const processTransactionData = (txData: TxData, opts: ProcessOptions): void => {
	const {
		onSetTransactionId,
		onActionRequired,
		onComplete,
		onLoadingEnd,
		onResetRetryState,
		isFlowActive
	} = opts;
	const isActive = isFlowActive ?? (() => true);

	if (!isActive()) return;

	const showError = (msg: string) => {
		if (!isActive()) return;
		void import("sonner").then(({ toast }) => toast.error(msg));
	};

	if (txData.errors?.length) {
		onResetRetryState?.();
		showError(`Lỗi khởi tạo thanh toán: ${txData.errors.map((e) => e.message ?? e.code).join(", ")}`);
		onLoadingEnd();
		return;
	}

	const txId = txData.transaction?.id;
	if (!txId) {
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
			onActionRequired?.({ transactionId: txId, paymentUrl });
			onLoadingEnd();
			return;
		}
		onResetRetryState?.();
		onLoadingEnd();
		showError("Không nhận được URL thanh toán từ VNPay. Vui lòng thử lại.");
		return;
	}

	// Per Saleor docs: transactionProcess must ONLY be called when transactionInitialize
	// returned ACTION_REQUIRED. For all other event types, proceed to checkoutComplete.
	const eventType = txData.transactionEvent?.type;

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
