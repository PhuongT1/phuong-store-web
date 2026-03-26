import { type FC, type ReactNode } from "react";
import { Typography } from "@components/ui";
import { cn } from "@/lib/utils";

interface SectionProps {
	children: ReactNode;
	title: string;
	className?: string;
}

export const Section: FC<SectionProps> = ({ children, title, className }) => (
	<div className={cn("mb-6", className)}>
		<Typography variant="title">{title}</Typography>
		{children}
	</div>
);
