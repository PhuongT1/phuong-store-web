import { vnpayGatewayId } from "./VNPay/types";

export interface HostedGatewayPresentation {
	id: string;
	label: string;
	logoSrc: string;
	logoAlt: string;
	description: string;
	ctaLabel: string;
}

export const hostedGatewayPresentations: Record<string, HostedGatewayPresentation> = {
	[vnpayGatewayId]: {
		id: vnpayGatewayId,
		label: "VNPay",
		logoSrc: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
		logoAlt: "VNPay",
		description: "Thanh toán an toàn qua cổng thanh toán VNPAY.",
		ctaLabel: "Mở trang thanh toán"
	}
};

export const getHostedGatewayPresentation = (gatewayId?: string | null) =>
	(gatewayId ? hostedGatewayPresentations[gatewayId] : undefined) ?? null;
