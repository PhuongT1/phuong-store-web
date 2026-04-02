"use client";

import { useEffect } from "react";

/**
 * Invisible client component that observes the sticky <header> element via
 * ResizeObserver and keeps the --header-height CSS custom property on :root
 * in sync with the actual rendered height.
 *
 * The CSS variable is initialised to 109px in theme.css as a SSR fallback;
 * this component corrects it immediately after hydration and on every resize.
 */
export const HeaderHeightSync = () => {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>("header");
		if (!header) return;

		const sync = () => {
			document.documentElement.style.setProperty(
				"--header-height",
				`${header.getBoundingClientRect().height}px`
			);
		};

		// Sync immediately on mount
		sync();

		const observer = new ResizeObserver(sync);
		observer.observe(header);

		return () => observer.disconnect();
	}, []);

	return null;
};
