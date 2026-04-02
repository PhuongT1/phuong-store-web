"use client";

import * as React from "react";
import { LoadingIcon } from "@assets/icons";
import { Portal } from "@radix-ui/react-portal";
import { cn } from "@/lib/utils";
type LoadingProps = {
	loadingColor?: string;
} & React.ComponentPropsWithRef<typeof Portal>;

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(({ ...rest }, ref) => {
	return (
		<Portal
			ref={ref}
			{...rest}
			className={cn("fixed inset-0 z-50 flex items-center justify-center bg-popover-60", rest?.className)}
		>
			<LoadingIcon />
		</Portal>
	);
});
Loading.displayName = "Loading";

export { Loading, type LoadingProps };
