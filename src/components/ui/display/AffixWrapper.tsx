import React, { type ComponentPropsWithoutRef, type PropsWithChildren, type ReactNode } from "react";
import { type Button, CloseButton } from "../Button";
import { type FieldErrorProps } from "../FieldError";
import { SlotBase } from "../FieldState";
import { cn } from "@/lib/utils";

type AffixProps = {
	prefix?: ReactNode;
	suffix?: ReactNode;
	allowClear?: boolean;
	clearButtonProps?: ComponentPropsWithoutRef<typeof Button>;
	applyErrorStyle?: boolean;
};

type AffixWrapperProps = AffixProps &
	Omit<ComponentPropsWithoutRef<"div">, keyof AffixProps> &
	Pick<FieldErrorProps, "error">;

const errorStyle = [
	// error
	"group-aria-[invalid=true]:border-destructive",
	"group-aria-[invalid=true]:ring-destructive/20",
	"dark:group-aria-[invalid=true]:ring-destructive/40",
	"group-aria-[invalid=true]:focus-within:border-destructive",
	"group-aria-[invalid=true]:focus-within:ring-destructive/20"
];

const AffixWrapper = React.forwardRef<HTMLDivElement, PropsWithChildren<AffixWrapperProps>>(
	({ prefix, suffix, children, allowClear, clearButtonProps, className, applyErrorStyle, ...rest }, ref) => {
		return (
			<div ref={ref} {...rest} className={cn("gap-2 px-3", applyErrorStyle && errorStyle, className)}>
				{prefix}
				<SlotBase className="min-w-0 flex-1">{children}</SlotBase>
				{suffix}
				{allowClear && <CloseButton {...clearButtonProps} />}
			</div>
		);
	}
);

AffixWrapper.displayName = "AffixWrapper";

export { AffixWrapper, type AffixWrapperProps };
