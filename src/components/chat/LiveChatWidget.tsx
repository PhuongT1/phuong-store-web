"use client";

import { useState } from "react";
import Script from "next/script";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// LiveChat Widget v2 types
// ---------------------------------------------------------------------------

type LiveChatWidgetInstance = {
	on: (event: string, cb: (data?: unknown) => void) => void;
	off: (event: string, cb: (data?: unknown) => void) => void;
	call: (method: "maximize" | "minimize" | "hide" | "destroy") => void;
	get: (property: string) => unknown;
	_q: unknown[];
	_h: null | ((...args: unknown[]) => void);
	_v: string;
	init: () => void;
};

declare global {
	interface Window {
		__lc: {
			license: number;
			integration_name: string;
			product_name: string;
			asyncInit?: boolean;
			[key: string]: unknown;
		};
		LiveChatWidget?: LiveChatWidgetInstance;
	}
}

// ---------------------------------------------------------------------------

const LICENSE_ID = Number(process.env.NEXT_PUBLIC_LIVECHAT_LICENSE ?? 19627809);

const hideLcContainer = () => {
	const el = document.getElementById("chat-widget-container");
	if (el) el.style.display = "none";
};

const showLcContainer = () => {
	const el = document.getElementById("chat-widget-container");
	if (el) el.style.display = "";
};

export function LiveChatWidget() {
	const [chatOpen, setChatOpen] = useState(false);

	const handleOpen = () => {
		setChatOpen(true);
		showLcContainer();
		window.LiveChatWidget?.call("maximize");
	};

	return (
		<>
			{/* Always hide the native LiveChat container; only show when chatOpen */}
			{!chatOpen && <style>{`#chat-widget-container { display: none !important; }`}</style>}

			{/* Step 1: set __lc config */}
			<Script id="livechat-config" strategy="afterInteractive">{`
				window.__lc = window.__lc || {};
				window.__lc.license = ${LICENSE_ID};
				window.__lc.integration_name = "manual_channels";
				window.__lc.product_name = "livechat";
				window.__lc.asyncInit = true;
			`}</Script>

			{/* Step 2: load LiveChat SDK — hide native launcher immediately on ready,
			    re-hide container whenever chat is minimized/closed */}
			<Script
				id="livechat-sdk"
				strategy="afterInteractive"
				src="https://cdn.livechatinc.com/tracking.js"
				onReady={() => {
					window.LiveChatWidget?.on("ready", () => {
						hideLcContainer();
						window.LiveChatWidget?.call("hide");
					});
					window.LiveChatWidget?.on("visibility_changed", (data) => {
						const visibility = (data as { visibility?: string })?.visibility;
						if (visibility === "minimized" || visibility === "hidden") {
							setChatOpen(false);
							hideLcContainer();
						}
					});
					window.LiveChatWidget?.init();
				}}
			/>

			{/* Custom trigger — always visible */}
			<button
				onClick={handleOpen}
				className={cn(
					"flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
					"bg-info text-white transition-transform hover:scale-105 active:scale-95"
				)}
				aria-label="Chat với nhân viên hỗ trợ"
			>
				<Headphones size={22} />
			</button>
		</>
	);
}
