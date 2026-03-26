import React from "react";
import { cn } from "@/lib/utils";

type SkeletonColumnLayoutProps = { columns?: number } & React.ComponentPropsWithRef<"div">;

const SkeletonColumnLayout = ({ columns = 2, className, ...rest }: SkeletonColumnLayoutProps) => {
	return (
		<div
			{...rest}
			className={cn(
				"flex w-full",
				columns === 2 && "justify-between",
				columns > 2 && "justify-evenly gap-3",
				className
			)}
		/>
	);
};
SkeletonColumnLayout.displayName = "SkeletonColumnLayout";

export { SkeletonColumnLayout };
