/**
 * VNPay Return Handler Page
 * Called when VNPay redirects back after payment
 * Handles both popup and full redirect scenarios
 */

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function VNPayReturnPage() {
	const router = useRouter();

	useEffect(() => {
		// Get ALL query params from URL (needed for signature verification on server)
		const params = new URLSearchParams(window.location.search);
		const allParams: Record<string, string> = {};
		params.forEach((value, key) => {
			allParams[key] = value;
		});

		const vnpResponseCode = allParams["vnp_ResponseCode"];
		const vnpTxnRef = allParams["vnp_TxnRef"];
		const vnpAmount = allParams["vnp_Amount"];
		const vnpTransactionNo = allParams["vnp_TransactionNo"];

		console.log("VNPay return params:", {
			responseCode: vnpResponseCode,
			txnRef: vnpTxnRef,
			amount: vnpAmount,
			transactionNo: vnpTransactionNo
		});

		const parentWindow =
			window.opener && window.opener !== window
				? window.opener
				: window.parent && window.parent !== window
					? window.parent
					: null;
		const isPopup = window.opener && window.opener !== window;
		const isEmbedded = !!parentWindow;

		if (vnpResponseCode === "00") {
			// Payment success
			console.log("✅ VNPay payment successful");

			if (isEmbedded && parentWindow) {
				// Send success message to popup opener or iframe parent window
				parentWindow.postMessage(
					{
						source: "hosted-payment-return",
						type: "PAYMENT_SUCCESS",
						data: {
							// All vnp_* params for server-side signature verification
							vnpParams: allParams,
							// Convenience fields
							responseCode: vnpResponseCode,
							txnRef: vnpTxnRef,
							amount: vnpAmount,
							transactionNo: vnpTransactionNo
						}
					},
					window.location.origin
				);

				if (isPopup) {
					// Close popup after short delay
					setTimeout(() => {
						window.close();
					}, 500);
				}
			} else {
				// Full redirect scenario - redirect to checkout with success
				const checkoutId = params.get("checkout") || sessionStorage.getItem("checkoutId");
				if (checkoutId) {
					void router.push(`/checkout?checkout=${checkoutId}&payment=success`);
				} else {
					void router.push("/checkout?payment=success");
				}
			}
		} else {
			// Payment failed or cancelled
			console.error("❌ VNPay payment failed:", vnpResponseCode);

			if (isEmbedded && parentWindow) {
				// Send error message to popup opener or iframe parent window
				parentWindow.postMessage(
					{
						source: "hosted-payment-return",
						type: vnpResponseCode === "24" ? "PAYMENT_CANCELLED" : "PAYMENT_ERROR",
						data: {
							responseCode: vnpResponseCode,
							txnRef: vnpTxnRef,
							errorMessage: getVNPayErrorMessage(vnpResponseCode)
						}
					},
					window.location.origin
				);

				if (isPopup) {
					setTimeout(() => {
						window.close();
					}, 500);
				}
			} else {
				// Full redirect scenario - redirect to checkout with error
				const checkoutId = params.get("checkout") || sessionStorage.getItem("checkoutId");
				if (checkoutId) {
					void router.push(`/checkout?checkout=${checkoutId}&payment=error&code=${vnpResponseCode}`);
				} else {
					void router.push(`/checkout?payment=error&code=${vnpResponseCode}`);
				}
			}
		}
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted">
			<div className="text-center">
				<div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
				<p className="text-lg text-muted-foreground">Đang xử lý thanh toán...</p>
			</div>
		</div>
	);
}

function getVNPayErrorMessage(code: string | null): string {
	switch (code) {
		case "07":
			return "Giao dịch bị nghi ngờ gian lận";
		case "09":
			return "Thẻ chưa đăng ký dịch vụ thanh toán online";
		case "10":
			return "Thẻ hết hạn sử dụng";
		case "11":
			return "Thẻ bị khóa";
		case "12":
			return "Thẻ chưa hợp lệ";
		case "13":
			return "Mật khẩu xác thực giao dịch không đúng";
		case "24":
			return "Khách hàng hủy giao dịch";
		case "51":
			return "Tài khoản không đủ số dư";
		case "65":
			return "Tài khoản đã vượt quá hạn mức giao dịch trong ngày";
		case "75":
			return "Ngân hàng thanh toán đang bảo trì";
		case "79":
			return "Giao dịch vượt quá số lần nhập sai mật khẩu";
		default:
			return "Giao dịch không thành công. Vui lòng thử lại.";
	}
}
