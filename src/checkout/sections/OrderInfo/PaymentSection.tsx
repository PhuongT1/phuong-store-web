import { AlertIcon, SuccessIcon } from "../../assets/icons";
import { Section } from "./Section";
import { useOrder } from "@/checkout/hooks/useOrder";
import { usePaymentStatus } from "@/checkout/sections/PaymentSection/utils";

const ErrorMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p className="mr-1 text-red-500">{message}</p>
			<AlertIcon />
		</>
	);
};

const SuccessMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p color="success" className="mr-1">
				{message}
			</p>
			<SuccessIcon />
		</>
	);
};

const PaymentSection = () => {
	const { order } = useOrder();
	const paymentStatus = usePaymentStatus(
		order ?? { chargeStatus: "NONE" as any, authorizeStatus: "NONE" as any }
	);

	const messagePayment = () => {
		switch (paymentStatus) {
			case "authorized":
				return <SuccessMessage message="Chúng tôi đã nhận được xác thực thanh toán của bạn." />;
			case "paidInFull":
				return <SuccessMessage message="Chúng tôi đã nhận được khoản thanh toán của bạn." />;
			case "overpaid":
				return (
					<ErrorMessage message="Đơn hàng của bạn đã được thanh toán nhiều hơn số tiền cần trả. Điều này có thể là một lỗi trong quá trình thanh toán. Vui lòng liên hệ với nhân viên cửa hàng để được hỗ trợ." />
				);
			default:
				return <SuccessMessage message="Thanh toán khi nhận hàng" />;
		}
	};

	return (
		<Section title="Phương thức thanh toán" className="mb-0">
			<div data-testid="paymentStatus">
				<div className="flex flex-row items-center">{messagePayment()}</div>
			</div>
		</Section>
	);
};
PaymentSection.displayName = "PaymentSection";

export { PaymentSection };
