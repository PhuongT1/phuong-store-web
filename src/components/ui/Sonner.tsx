"use client";

import { CircleAlert, CircleCheck, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { type ExternalToast, type ToasterProps, Toaster as Sonner, toast } from "sonner";
import { CONFIG } from "@/constants";

type titleT = (() => React.ReactNode) | React.ReactNode;

const Toaster = ({ ...props }: ToasterProps) => {
	const { resolvedTheme = "light" } = useTheme();
	const isDark = resolvedTheme === "dark";

	const warningText = isDark ? "var(--warning)" : "var(--warning-foreground)";
	const successText = isDark ? "var(--success)" : "var(--success-light)";
	const errorText = isDark ? "var(--destructive)" : "var(--destructive)";
	const errorBg = isDark ? "var(--card)" : "var(--background)";
	/* Error toast: card bg + destructive border/text = Revoke-button visual (outlined, not filled) */

	return (
		<Sonner
			theme={resolvedTheme as ToasterProps["theme"]}
			className="toaster group !backdrop-blur-2xl"
			closeButton
			style={
				{
					fontFamily: "var(--font-inter)",
					"--width": "max-content",
					maxWidth: "50vw",
					// Warning — amber tonal
					"--warning-bg": "var(--warning-muted)",
					"--warning-text": warningText,
					"--warning-border": "var(--warning)",
					// Success — green tonal
					"--success-bg": "var(--success-muted)",
					"--success-text": successText,
					"--success-border": "var(--success)",
					// Error — outlined (Revoke-button style)
					"--error-bg": errorBg,
					"--error-text": errorText,
					"--error-border": "var(--destructive)"
				} as React.CSSProperties
			}
			position="top-right"
			icons={{
				success: <CircleCheck className="size-5" style={{ color: "var(--success)" }} />,
				error: <CircleAlert className="size-5" style={{ color: "var(--destructive)" }} />,
				warning: <TriangleAlertIcon className="size-5" style={{ color: "var(--warning)" }} />,
				info: <InfoIcon className="size-5" style={{ color: "var(--info)" }} />
			}}
			{...props}
		/>
	);
};

const baseOptions: ExternalToast = {
	closeButton: true
};

const toastStyle = {
	warning: {
		background: "var(--toast-warning-bg)",
		color: "var(--card-foreground)",
		border: "1px solid var(--warning)"
	} as React.CSSProperties,
	error: {
		background: "color-mix(in srgb, var(--toast-error-bg) 90%, transparent)",
		color: "var(--card-foreground)",
		border: "1px solid var(--destructive)",
		backdropFilter: "blur(16px)"
	} as React.CSSProperties,
	success: {
		background: "color-mix(in srgb, var(--toast-success-bg) 90%, transparent)",
		color: "var(--card-foreground)",
		border: "1.5px solid var(--success)",
		backdropFilter: "blur(16px)"
	} as React.CSSProperties,
	info: {
		background: "var(--info-muted)",
		color: "var(--card-foreground)",
		border: "1.5px solid var(--info)"
	} as React.CSSProperties
};

const notify = {
	...toast,
	success: (msg: titleT | React.ReactNode, data?: ExternalToast) =>
		toast.success(msg, {
			duration: CONFIG.TOAST_DURATION.success,
			style: toastStyle.success,
			...baseOptions,
			...data
		}),
	error: (msg: titleT | React.ReactNode, data?: ExternalToast) =>
		toast.error(msg, {
			duration: CONFIG.TOAST_DURATION.error || 3000,
			style: toastStyle.error,
			...baseOptions,
			...data
		}),
	warning: (msg: string, data?: ExternalToast) =>
		toast.warning(msg, {
			duration: 4000,
			style: toastStyle.warning,
			...data
		}),
	info: (msg: titleT | React.ReactNode, data?: ExternalToast) =>
		toast.info(msg, {
			duration: Infinity,
			position: "bottom-right",
			style: toastStyle.info,
			...baseOptions,
			...data
		})
};

export { Toaster, notify };
