import { type VNPayComponentProps } from "./types";

export const VNPayComponent = ({ config }: VNPayComponentProps) => {
	return (
		<div className="text-muted-foreground text-sm">
			<p>Thanh toán qua VNPay</p>
			<p className="text-muted-foreground/70 mt-1 text-xs">
				Hỗ trợ thẻ ATM, thẻ tín dụng/ghi nợ nội địa và quốc tế
			</p>
		</div>
	);
};
