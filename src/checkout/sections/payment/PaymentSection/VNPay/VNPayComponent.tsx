import { getHostedGatewayPresentation } from "../hostedGateways";
import { type VNPayComponentProps } from "./types";

export const VNPayComponent = ({ config }: VNPayComponentProps) => {
	const presentation = getHostedGatewayPresentation(config.id);

	return (
		<div className="flex items-center gap-2.5 text-muted-foreground/78 text-xs leading-relaxed">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/45 bg-white p-1.5">
				<img
					src={presentation?.logoSrc}
					alt={presentation?.logoAlt ?? "VNPay"}
					className="max-h-full max-w-full object-contain"
				/>
			</div>
			<p>Thanh toán trong cửa sổ bảo mật của VNPAY. Hỗ trợ ATM, QR và thẻ nội địa/quốc tế.</p>
		</div>
	);
};
