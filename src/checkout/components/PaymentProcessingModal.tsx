/**
 * Payment Processing Modal
 * Shown after payment popup closes, while waiting for webhook confirmation
 *
 * UX Pattern: Shopee, Lazada, PayPal
 */

"use client";

import { useEffect } from "react";

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
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

			{/* Modal */}
			<div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
				{/* Animated Spinner */}
				<div className="mx-auto mb-6 h-20 w-20">
					<div className="h-full w-full animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
				</div>

				{/* Title */}
				<h2 className="mb-3 text-center text-2xl font-bold text-gray-900">Đang xử lý thanh toán</h2>

				{/* Description */}
				<p className="mb-6 text-center text-gray-600">
					Vui lòng đợi trong giây lát. Chúng tôi đang xác nhận giao dịch của bạn với ngân hàng.
				</p>

				{/* Progress Bar */}
				<div className="mb-6">
					<div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-500">
							{seconds < 60 ? `${seconds} giây` : `${Math.floor(seconds / 60)} phút ${seconds % 60} giây`}
						</span>
						<span className="text-gray-400">{Math.round(progress)}%</span>
					</div>
				</div>

				{/* Status Messages */}
				<div className="mb-6 space-y-2">
					{seconds < 5 && (
						<div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
							<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
							<p className="text-sm text-blue-700">Đang kết nối với ngân hàng...</p>
						</div>
					)}
					{seconds >= 5 && seconds < 15 && (
						<div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
							<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
							<p className="text-sm text-blue-700">Đang xác minh giao dịch...</p>
						</div>
					)}
					{seconds >= 15 && seconds < 30 && (
						<div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
							<div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
							<p className="text-sm text-yellow-700">Đang chờ phản hồi từ ngân hàng...</p>
						</div>
					)}
					{seconds >= 30 && (
						<div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3">
							<div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
							<p className="text-sm text-orange-700">Giao dịch mất nhiều thời gian hơn bình thường...</p>
						</div>
					)}
				</div>

				{/* Warning */}
				<div className="mb-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
					<div className="flex gap-3">
						<span className="text-2xl">⚠️</span>
						<div>
							<p className="mb-1 font-semibold text-yellow-900">Vui lòng không đóng trang này</p>
							<p className="text-sm text-yellow-700">
								Giao dịch đang được xử lý. Đóng trang có thể gây gián đoạn thanh toán.
							</p>
						</div>
					</div>
				</div>

				{/* Help Text */}
				{seconds > 20 && (
					<div className="rounded-lg bg-gray-50 p-4 text-center">
						<p className="mb-2 text-sm text-gray-600">Nếu bạn đã thanh toán thành công nhưng đang chờ lâu:</p>
						<button
							onClick={onCancel}
							className="text-sm font-medium text-blue-600 underline hover:text-blue-700"
						>
							Kiểm tra trạng thái đơn hàng →
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
