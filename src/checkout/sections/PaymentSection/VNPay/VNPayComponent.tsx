import { type VNPayComponentProps } from "./types";

export const VNPayComponent = ({ config }: VNPayComponentProps) => {
	return (
		<div className="text-sm text-gray-600">
			<p>Thanh toán qua VNPay</p>
			<p className="mt-1 text-xs text-gray-500">Hỗ trợ thẻ ATM, thẻ tín dụng/ghi nợ nội địa và quốc tế</p>
		</div>
	);
};
