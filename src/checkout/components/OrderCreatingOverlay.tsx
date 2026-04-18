"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

interface OrderCreatingOverlayProps {
	isOpen: boolean;
}

/**
 * Simple full-screen overlay shown while `checkoutComplete` is in flight for
 * COD (and any other payment method that doesn't need the full VNPay polling
 * modal). Design mirrors `PaymentProcessingModal` — same spinner, card, and
 * backdrop — but without timer / progress bar / cancel button.
 */
export const OrderCreatingOverlay = ({ isOpen }: OrderCreatingOverlayProps) => {
	const t = useTranslations("checkout");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen || !mounted) return null;

	return createPortal(
		<div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div className="bg-overlay absolute inset-0 backdrop-blur-[1.5px] sm:backdrop-blur-[5px]" />

			{/* Card */}
			<div className="surface-overlay relative z-10 w-full max-w-[min(26rem,calc(100vw-2rem))] p-7 text-center sm:p-8">
				{/* Spinner */}
				<div className="mx-auto mb-6 h-20 w-20">
					<div className="border-muted/80 border-t-info h-full w-full animate-spin rounded-full border-4" />
				</div>

				<h2 className="text-foreground mb-3 text-2xl font-bold">{t("creatingOrder")}</h2>
				<p className="text-muted-foreground">{t("creatingOrderWait")}</p>

				{/* Pulse dot row */}
				<div className="bg-info/12 border-info/28 mt-6 flex items-center justify-center gap-2 rounded-xl border p-3" aria-live="polite">
					<div className="bg-info h-2 w-2 animate-pulse rounded-full" />
					<p className="text-info text-sm font-medium">{t("processing")}</p>
				</div>
			</div>
		</div>,
		document.body
	);
};
