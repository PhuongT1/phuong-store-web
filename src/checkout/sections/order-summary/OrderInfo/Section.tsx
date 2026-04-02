import { type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@components/ui";

interface SectionProps {
	children: ReactNode;
	title: string;
	className?: string;
}

export const Section: FC<SectionProps> = ({ children, title, className }) => (
	<div className={cn("py-4", className)}>
		<Typography variant="title">{title}</Typography>
		{children}
	</div>
);
