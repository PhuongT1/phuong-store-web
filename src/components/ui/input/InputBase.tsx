"use client";

import React, { type ComponentPropsWithoutRef, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CONFIG } from "@config/config";
import { AffixWrapper } from "../display/AffixWrapper";
import { type FieldErrorProps } from "../FieldError";

type Addon = React.ComponentProps<"div">["children"];
type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size">;

type InputPrimitivesProps = {
	addonBefore?: Addon;
	addonAfter?: Addon;
	onValueCommit?: <T>(value: T) => void;
	allowNegative?: boolean;
} & Pick<FieldErrorProps, "error"> &
	InputProps &
	VariantProps<typeof inputVariants>;

type InputWrapperProps = {
	affixWrapperProps?: ComponentPropsWithoutRef<typeof AffixWrapper>;
} & InputPrimitivesProps;

type UseValueTrackerProps<T> = {
	value: T;
	onValueCommit?: (prev: T | undefined, next: T) => void;
	compareFn?: (a: T | undefined, b: T) => boolean; // optional custom compare
};

// error Style get from AffixWrapper component
const inputVariants = cva(
	[
		"group",
		"relative z-0 inline-flex items-center w-full min-w-0 overflow-hidden rounded-xl border text-sm focus-within:z-20",
		// bg-input: recessed page-gray on white card (light) / raised above card (dark)
		"bg-input border-border/70 text-(--input-foreground) placeholder:text-muted-foreground",
		"transition-all duration-200",
		"selection:bg-primary selection:text-primary-foreground",
		// focus — border strengthens, subtle halo ring
		"focus-within:border-focus-ring/55 focus-within:ring-2 focus-within:ring-focus-ring/22 focus-within:ring-inset",
		// hover
		"hover:border-border",
		// disabled
		"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
		// error
		"group-aria-[invalid=true]:border-destructive",
		"group-aria-[invalid=true]:ring-destructive/15",
		"dark:group-aria-[invalid=true]:ring-destructive/20",
		"group-aria-[invalid=true]:focus-within:border-destructive",
		"group-aria-[invalid=true]:focus-within:ring-destructive/15 group-aria-[invalid=true]:focus-within:ring-inset"
	],
	{
		variants: {
			variant: {
				default: ""
			},
			sizeVariant: CONFIG.SIZE_VARIANT
		},
		defaultVariants: {
			variant: "default",
			sizeVariant: "medium"
		}
	}
);

const useValueTracker = <T,>({ value, onValueCommit, compareFn }: UseValueTrackerProps<T>) => {
	const prevRef = useRef<T | undefined>(undefined);

	const handleFocus = () => {
		prevRef.current = value;
	};

	const handleBlur = () => {
		const isEqual = compareFn ? compareFn(prevRef.current, value) : prevRef.current === value;

		if (!isEqual) {
			onValueCommit?.(prevRef.current, value);
		}
	};

	return { handleFocus, handleBlur };
};

const InputBase = React.forwardRef<HTMLInputElement, InputPrimitivesProps>(
	({ error, value, onFocus, onBlur, onValueCommit, ...inputProps }, ref) => {
		const { allowNegative: _allowNegative, ...domInputProps } = inputProps;
		const { handleFocus, handleBlur } = useValueTracker({
			value,
			onValueCommit: (_prev, next) => {
				onValueCommit?.(next);
			}
		});
		const placeholder =
			domInputProps?.placeholder && `${domInputProps.placeholder}${domInputProps.required ? " *" : ""}`;

		// Normalize undefined → "" to keep inputs always controlled when a value prop is provided.
		// React throws "uncontrolled → controlled" when value changes from undefined to a string.
		// Fix at the component boundary: any defined value prop (including from RHF spread) is kept,
		// undefined is coerced to "" so the input stays controlled its entire lifetime.
		const rawValue = "value" in domInputProps ? domInputProps.value : value;
		const controlledValue = rawValue !== undefined ? rawValue : value !== undefined ? "" : undefined;
		const { value: _dropValue, ...safeProps } = domInputProps as typeof domInputProps & { value?: unknown };

		return (
			<input
				{...safeProps}
				ref={ref}
				{...(controlledValue !== undefined
					? { value: controlledValue as string | number | readonly string[] }
					: {})}
				spellCheck={false}
				placeholder={placeholder}
				autoComplete="off"
				autoCorrect="off"
				className={cn("min-w-0 focus:outline-none", "flex-1", safeProps?.className)}
				onFocus={(e) => {
					handleFocus();
					onFocus?.(e);
				}}
				onBlur={(e) => {
					handleBlur();
					onBlur?.(e);
				}}
			/>
		);
	}
);
InputBase.displayName = "InputBase";

const InputWrapper = React.forwardRef<HTMLInputElement, InputWrapperProps>(
	({ affixWrapperProps, variant = "default", sizeVariant = "small", ...restProps }, ref) => {
		return (
			<AffixWrapper
				{...affixWrapperProps}
				className={cn(inputVariants({ variant, sizeVariant, className: affixWrapperProps?.className }))}
			>
				<InputBase ref={ref} {...restProps} />
			</AffixWrapper>
		);
	}
);
InputWrapper.displayName = "InputWrapper";

export { InputWrapper, type InputPrimitivesProps, type InputProps, type InputWrapperProps };
