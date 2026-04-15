"use client";

import SimpleBar from "simplebar-react";
import type { Props as SimpleBarProps } from "simplebar-react";
import { cn } from "@/lib/utils";

import "simplebar-react/dist/simplebar.min.css";

type ScrollbarProps = SimpleBarProps & {
	maxHeight?: number | string;
};

/**
 * Drop-in scrollable container backed by SimpleBar.
 * Applies project-wide scrollbar theming via CSS variables.
 * Use `maxHeight` to cap the scrollable area, `className` for sizing.
 */
const Scrollbar = ({
	className,
	children,
	style,
	maxHeight,
	...props
}: ScrollbarProps) => (
	<SimpleBar
		className={cn("min-h-0", className)}
		style={{ maxHeight, ...style }}
		clickOnTrack={false}
		{...props}
	>
		{children}
	</SimpleBar>
);

Scrollbar.displayName = "Scrollbar";

export { Scrollbar };
export type { ScrollbarProps };
