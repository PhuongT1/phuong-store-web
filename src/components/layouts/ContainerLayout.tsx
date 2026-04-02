import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerLayoutProps = {
	children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const ContainerLayout = ({ children, className, ...rest }: ContainerLayoutProps) => (
	<div {...rest} className={cn("mx-auto w-full max-w-[1440px] flex-1 px-3 py-4 md:px-6 lg:px-8", className)}>
		{children}
	</div>
);
ContainerLayout.displayName = "ContainerLayout";

export { ContainerLayout, type ContainerLayoutProps };
