import { type PropsWithChildren } from "react";
import { type Classes } from "../lib/globalTypes";
import { cn } from "@/lib/utils";

interface SelectBoxGroupProps extends Classes {
	label: string;
}

export const SelectBoxGroup: React.FC<PropsWithChildren<SelectBoxGroupProps>> = ({
	label,
	children,
	className
}) => {
	return (
		<div role="radiogroup" aria-label={label} className={cn(`mt-4 grid gap-4 md:grid-cols-2`, className)}>
			{children}
		</div>
	);
};
