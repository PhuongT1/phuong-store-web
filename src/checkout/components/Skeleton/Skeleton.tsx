import clsx from "clsx";
import React, { type PropsWithChildren } from "react";
import { type Classes } from "@/checkout/lib/globalTypes";

export interface SkeletonProps extends Classes {
	variant?: "paragraph" | "title";
}

export const Skeleton: React.FC<PropsWithChildren<SkeletonProps>> = ({
	children,
	className,
	variant = "paragraph"
}) => {
	const classes = clsx(
		"bg-neutral-200 h-4 rounded animate-pulse",
		{ "mb-6 w-1/3 h-6": variant === "title", "h-4": variant === "paragraph" },
		className
	);

	return <div className={classes}>{children}</div>;
};
