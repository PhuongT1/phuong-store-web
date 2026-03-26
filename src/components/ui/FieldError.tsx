import React from "react";
import { cn } from "@/lib/utils";

type FieldErrorProps = {
	error?: React.ComponentProps<"p">["children"];
} & React.ComponentProps<"p">;

const FieldError = ({ error, ...restProps }: FieldErrorProps) => {
	if (!error) return null;
	return (
		<p
			{...restProps}
			data-slot="form-message"
			className={cn("text-destructive text-sm", restProps?.className)}
		>
			{error}
		</p>
	);
};
FieldError.displayName = "FieldError";

export { FieldError, type FieldErrorProps };
