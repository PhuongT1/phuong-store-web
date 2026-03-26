"use client";

import { CircleAlert, CircleCheck, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { type ExternalToast, type ToasterProps, Toaster as Sonner, toast } from "sonner";
import { CONFIG } from "@/constants";

type titleT = (() => React.ReactNode) | React.ReactNode;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			closeButton
			style={
				{
					fontFamily: "var(--font-inter)",
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--width": "max-content",
					maxWidth: "50vw"
				} as React.CSSProperties
			}
			position="top-right"
			icons={{
				success: <CircleCheck className="size-5" color="var(--toastify-success)" />,
				error: <CircleAlert className="size-5" color="var(--toastify-error)" />,
				warning: <TriangleAlertIcon className="size-5" />,
				info: <InfoIcon className="size-5" />
			}}
			{...props}
		/>
	);
};

const baseOptions: ExternalToast = {
	closeButton: true
};

const notify = {
	...toast,
	success: (msg: titleT | React.ReactNode, data?: ExternalToast) =>
		toast.success("Thông báo", {
			duration: CONFIG.TOAST_DURATION.success,
			description: msg,
			// duration: Infinity,
			...baseOptions,
			...data
		}),
	error: (msg: titleT | React.ReactNode, data?: ExternalToast) =>
		toast.error(msg, {
			duration: CONFIG.TOAST_DURATION.error || 3000,
			...baseOptions,
			...data
		}),
	warning: (msg: string) => toast.warning(msg, { duration: 4000 }),
	info: (msg: titleT | React.ReactNode, data?: ExternalToast) =>
		toast.success(msg, {
			duration: Infinity,
			position: "bottom-right",
			...baseOptions,
			...data
		})
};

export { Toaster, notify };
