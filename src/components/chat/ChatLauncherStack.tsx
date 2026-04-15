"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * ChatLauncherStack — fixed container at bottom-right.
 * All chat trigger buttons go inside here as children.
 * They stack vertically (bottom → top) using flex-col-reverse + gap.
 * Adding a new button never breaks existing layout.
 */
export function ChatLauncherStack({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isCheckout = pathname?.includes("/checkout");

	return (
		<div
			className="fixed right-4 bottom-[5.25rem] z-50 flex flex-row-reverse items-end gap-2 sm:flex-col-reverse sm:gap-3"
			style={{
				right: "var(--chat-right)",
				bottom: isCheckout ? "max(6.75rem, var(--chat-bottom))" : "15px"
			}}
		>
			{children}
		</div>
	);
}
