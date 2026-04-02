/**
 * Payment Processing Modal
 * Shown after payment popup closes, while waiting for webhook confirmation
 *
 * UX Pattern: Shopee, Lazada, PayPal
 */

"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface PaymentProcessingModalProps {
	isOpen: boolean;
	timeElapsed: number;
	maxTime?: number;
	onCancel?: () => void;
}

export const PaymentProcessingModal = ({
	isOpen,
	timeElapsed,
	maxTime = 60000,
	onCancel
}: PaymentProcessingModalProps) => {
	const t = useTranslations("checkout");
	const seconds = Math.floor(timeElapsed / 1000);
	const progress = Math.min((timeElapsed / maxTime) * 100, 100);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div className="bg-overlay absolute inset-0 backdrop-blur-sm" />

			{/* Modal */}
			<div className="bg-card relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl p-8 shadow-2xl transition-all">
				{/* Animated Spinner */}
				<div className="mx-auto mb-6 h-20 w-20">
					<div className="border-muted border-t-primary h-full w-full animate-spin rounded-full border-4" />
				</div>

				{/* Title */}
				<h2 className="text-foreground mb-3 text-center text-2xl font-bold">{t("processingPayment")}</h2>

				{/* Description */}
				<p className="text-muted-foreground mb-6 text-center">{t("processingWait")}</p>

				{/* Progress Bar */}
				<div className="mb-6">
					<div className="bg-muted mb-2 h-2 w-full overflow-hidden rounded-full">
						<div
							className="from-primary/80 to-primary h-full bg-linear-to-r transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							{seconds < 60
								? t("secondsElapsed", { count: seconds })
								: t("minutesSecondsElapsed", { minutes: Math.floor(seconds / 60), seconds: seconds % 60 })}
						</span>
						<span className="text-muted-foreground/70">{Math.round(progress)}%</span>
					</div>
				</div>

				{/* Status Messages */}
				<div className="mb-6 space-y-2">
					{seconds < 5 && (
						<div className="bg-info/10 flex items-center gap-2 rounded-lg p-3">
							<div className="bg-info h-2 w-2 animate-pulse rounded-full" />
							<p className="text-info text-sm">{t("connectingBank")}</p>
						</div>
					)}
					{seconds >= 5 && seconds < 15 && (
						<div className="bg-info/10 flex items-center gap-2 rounded-lg p-3">
							<div className="bg-info h-2 w-2 animate-pulse rounded-full" />
							<p className="text-info text-sm">{t("verifyingTransaction")}</p>
						</div>
					)}
					{seconds >= 15 && seconds < 30 && (
						<div className="bg-warning-muted flex items-center gap-2 rounded-lg p-3">
							<div className="bg-warning h-2 w-2 animate-pulse rounded-full" />
							<p className="text-warning text-sm">{t("waitingBankResponse")}</p>
						</div>
					)}
					{seconds >= 30 && (
						<div className="bg-badge-hot-muted flex items-center gap-2 rounded-lg p-3">
							<div className="bg-badge-hot h-2 w-2 animate-pulse rounded-full" />
							<p className="text-badge-hot text-sm">{t("transactionTakingLong")}</p>
						</div>
					)}
				</div>

				{/* Warning */}
				<div className="border-warning/30 bg-warning-muted mb-6 rounded-lg border-2 p-4">
					<div className="flex gap-3">
						<span className="text-2xl">⚠️</span>
						<div>
							<p className="text-warning mb-1 font-semibold">
								{t("doNotClosePage")}
							</p>
							<p className="text-warning/80 text-sm">
								{t("transactionProcessing")}
							</p>
						</div>
					</div>
				</div>

				{/* Help Text */}
				{seconds > 20 && (
					<div className="bg-muted rounded-lg p-4 text-center">
						<p className="text-muted-foreground mb-2 text-sm">{t("paidSuccessWaitLong")}</p>
						<button onClick={onCancel} className="text-info hover:text-info/80 text-sm font-medium underline">
							{t("checkOrderStatus")}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
