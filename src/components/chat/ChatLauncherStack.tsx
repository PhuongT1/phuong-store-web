"use client";

import { type ReactNode } from "react";

/**
 * ChatLauncherStack — fixed container at bottom-right.
 * All chat trigger buttons go inside here as children.
 * They stack vertically (bottom → top) using flex-col-reverse + gap.
 * Adding a new button never breaks existing layout.
 */
export function ChatLauncherStack({ children }: { children: ReactNode }) {
	return (
		<div
			className="fixed z-50 flex flex-col-reverse items-end gap-3"
			style={{ right: "var(--chat-right)", bottom: "var(--chat-bottom)" }}
		>
			{children}
		</div>
	);
}
