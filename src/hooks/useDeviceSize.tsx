"use client";

import { useState, useEffect } from "react";

const useDeviceSize = (mobileBreakpoint = 768, tabletBreakpoint = 1024) => {
	const [isMobile, setIsMobile] = useState(false); // Tracks if the device width is below the mobile breakpoint
	const [isTablet, setIsTablet] = useState(false); //Tracks if the device width is between the mobile and tablet breakpoints
	const [isTabletOrBelow, setIsTabletOrBelow] = useState(false); // Tracks if the device width is tablet size or smaller (tablet or mobile)

	useEffect(() => {
		const checkDeviceSize = () => {
			const width = window.innerWidth;

			setIsMobile(width < mobileBreakpoint);
			setIsTablet(width >= mobileBreakpoint && width <= tabletBreakpoint);
			setIsTabletOrBelow(width <= tabletBreakpoint);
		};

		checkDeviceSize();
		window.addEventListener("resize", checkDeviceSize);

		return () => window.removeEventListener("resize", checkDeviceSize);
	}, [mobileBreakpoint, tabletBreakpoint]);

	return { isMobile, isTablet, isTabletOrBelow };
};

export { useDeviceSize };
