import { type ComponentProps } from "react";
import { FieldError, type FieldErrorProps } from "./FieldError";
import { type TextInputProps } from "./input/Input";
import { FieldSlot } from "./FieldState";
import { cn } from "@/lib/utils";

export type FieldWrapper = Pick<TextInputProps<string>, "label" | "required"> &
	ComponentProps<"div"> &
	Pick<FieldErrorProps, "error">;

export const FieldWrapper = ({ label, required, children, error, ...restProps }: FieldWrapper) => {
	return (
		<FieldSlot {...restProps} error={error}>
			<div className={cn("group flex flex-col gap-2")}>
				<div className="flex flex-col gap-2">
					{label && (
						<span className="text-xs text-neutral-700">
							{label}
							{required && <span aria-hidden="true">*</span>}
						</span>
					)}
					{children && <>{children}</>}
				</div>
				<FieldError error={error} />
			</div>
		</FieldSlot>
	);
};

FieldWrapper.displayName = "FieldWrapper";
