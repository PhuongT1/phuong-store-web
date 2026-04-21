"use client";

import { useEffect } from "react";

const HIDE_DELTA_PX = 14;
const SHOW_DELTA_PX = 10;

export const HeaderHeightSync = () => {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>("header");
		if (!header) return;

		const root = document.documentElement;
		let lastScrollY = Math.max(window.scrollY, 0);
		let isHidden = false;
		let downDistance = 0;
		let upDistance = 0;

		const getHeaderHeight = () => Math.max(0, header.getBoundingClientRect().height);

		const syncVars = () => {
			const headerHeight = getHeaderHeight();
			const headerShift = isHidden ? headerHeight : 0;

			root.style.setProperty("--header-height", `${headerHeight}px`);
			root.style.setProperty("--header-shift", `${headerShift}px`);
			root.style.setProperty("--header-sticky-offset", `${headerHeight - headerShift}px`);
		};

		const showHeader = () => {
			if (!isHidden) return;
			isHidden = false;
			syncVars();
		};

		const hideHeader = () => {
			if (isHidden) return;
			isHidden = true;
			syncVars();
		};

		const handleScroll = () => {
			const currentScrollY = Math.max(window.scrollY, 0);
			const delta = currentScrollY - lastScrollY;

			if (delta > 0) {
				downDistance += delta;
				upDistance = 0;
			} else if (delta < 0) {
				upDistance += Math.abs(delta);
				downDistance = 0;
			}

			const headerHeight = getHeaderHeight();
			const nearTop = currentScrollY <= Math.max(0, headerHeight * 0.75);

			if (!isHidden) {
				const canHide = currentScrollY > headerHeight + 4;
				if (canHide && downDistance >= HIDE_DELTA_PX) {
					hideHeader();
					downDistance = 0;
				}
			} else if (nearTop || upDistance >= SHOW_DELTA_PX) {
				showHeader();
				upDistance = 0;
			}

			if (currentScrollY <= 0) {
				showHeader();
				downDistance = 0;
				upDistance = 0;
			}

			lastScrollY = currentScrollY;
		};

		syncVars();

		const observer = new ResizeObserver(syncVars);
		observer.observe(header);

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return null;
};
