"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HostedGatewayPresentation } from "@/checkout/sections/payment/PaymentSection/hostedGateways";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

interface HostedPaymentModalProps {
	isOpen: boolean;
	url?: string | null;
	gateway: HostedGatewayPresentation | null;
	onOpenChange: (open: boolean) => void;
	onOpenExternal?: () => void;
}

export const HostedPaymentModal = ({
	isOpen,
	url,
	gateway,
	onOpenChange,
	onOpenExternal
}: HostedPaymentModalProps) => {
	const t = useTranslations("checkout");
	const [isFrameReady, setIsFrameReady] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsFrameReady(false);
		}
	}, [isOpen, url]);

	const hostname = useMemo(() => {
		if (!url) return "";
		try {
			return new URL(url).hostname.replace(/^www\./, "");
		} catch {
			return "";
		}
	}, [url]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="flex h-[min(92vh,820px)] w-[min(100vw-1rem,1040px)] max-w-[min(100vw-1rem,1040px)] flex-col gap-0 overflow-hidden rounded-[28px] border-border/55 bg-card/98 p-0 shadow-[0_32px_90px_rgba(15,23,42,0.32)]">
				<DialogHeader className="border-border/55 bg-card/98 shrink-0 border-b px-5 py-4 pr-16 text-left sm:px-6">
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0 flex-1">
							<div className="mb-2 flex items-center gap-3">
								{gateway?.logoSrc ? (
									<div className="bg-background/82 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/50 p-2">
										<img
											src={gateway.logoSrc}
											alt={gateway.logoAlt}
											className="max-h-full max-w-full object-contain"
										/>
									</div>
								) : null}
								<div className="min-w-0">
									<DialogTitle className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
										{gateway?.label ?? "Payment Gateway"}
									</DialogTitle>
									<DialogDescription className="mt-0.5 text-sm">
										{gateway?.description ?? t("processingWait")}
									</DialogDescription>
								</div>
							</div>
							<div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
								<ShieldCheck className="h-4 w-4 shrink-0 text-info" />
								<span className="truncate">
									{hostname ? `Kết nối bảo mật tới ${hostname}` : "Kết nối bảo mật"}
								</span>
							</div>
						</div>
						<Button
							type="button"
							variant="outline"
							className="hidden shrink-0 rounded-full sm:inline-flex"
							onClick={onOpenExternal}
						>
							<ExternalLink className="h-4 w-4" />
							{gateway?.ctaLabel ?? t("placeOrder")}
						</Button>
					</div>
				</DialogHeader>

				<div className="relative min-h-0 flex-1 bg-background">
					{url ? (
						<>
							{!isFrameReady && (
								<div className="bg-background/95 absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
									<div className="border-muted/80 border-t-info h-12 w-12 animate-spin rounded-full border-4" />
									<div className="space-y-1 text-center">
										<p className="text-foreground text-sm font-semibold">{t("processingPayment")}</p>
										<p className="text-muted-foreground text-sm">
											{gateway?.description ?? "Đang mở cổng thanh toán..."}
										</p>
									</div>
								</div>
							)}
							<iframe
								title={gateway?.label ?? "Hosted payment"}
								src={url}
								onLoad={() => setIsFrameReady(true)}
								className={cn(
									"h-full w-full border-0 bg-white",
									!isFrameReady && "opacity-0",
									isFrameReady && "opacity-100"
								)}
								allow="payment *"
								referrerPolicy="strict-origin-when-cross-origin"
							/>
						</>
					) : (
						<div className="flex h-full items-center justify-center px-6 text-center">
							<p className="text-muted-foreground text-sm">Đang chuẩn bị cổng thanh toán...</p>
						</div>
					)}
				</div>

				<div className="border-border/55 bg-card/98 flex shrink-0 items-center justify-between gap-3 border-t px-4 py-3 sm:px-6">
					<p className="text-muted-foreground text-xs sm:text-sm">
						{t("doNotClosePage")}
					</p>
					<Button type="button" variant="ghost" className="rounded-full sm:hidden" onClick={onOpenExternal}>
						<ExternalLink className="h-4 w-4" />
						{gateway?.ctaLabel ?? "Open"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
