import React, { type ElementType, type ReactNode } from "react";
import { cn } from "@lib/utils";
import { typographyVariants } from "./TypographyVariants";

interface TypographyProps {
	variant?: keyof typeof typographyVariants;
	component?: ElementType;
	className?: string;
	children: ReactNode;
}

const Typography = ({
	variant = "body1",
	component: Component = "p",
	className,
	children,
	...props
}: TypographyProps) => {
	const variantClasses = typographyVariants[variant] || typographyVariants.body1;

	return (
		<Component className={cn(variantClasses, className)} {...props}>
			{children}
		</Component>
	);
};

export { Typography };
