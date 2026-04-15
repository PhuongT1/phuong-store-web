"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { OptionList, Option } from "@/types";
import type { Label } from "./Label";

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"border-border/80 focus-visible:ring-info/40 relative isolate aspect-square h-[18px] w-[18px] shrink-0 rounded-full border-2 bg-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
				"data-[state=checked]:border-info",
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<span className="bg-info h-2 w-2 rounded-full" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

type RadioListProps = {
	name: string;
	children?: React.ReactNode;
	radioItemProps?: RadioItemProps;
	allowDeselect?: boolean;
} & OptionList<Option<string>> &
	Omit<React.ComponentPropsWithoutRef<typeof RadioGroup>, "value" | "defaultValue" | "onValueChange">;

type RadioItemProps = {
	divProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
	optionProps?: Option<string>;
	labelProps?: React.ComponentPropsWithoutRef<typeof Label>;
	isActive?: boolean;
	disabled?: boolean;
	allowDeselect?: boolean;
	onToggle?: (value: string) => void;
} & VariantProps<typeof radioVariants>;

const radioVariants = cva("relative flex items-center space-x-2", {
	variants: {
		variant: {
			default: "",
			border: [
				"group",
				"cursor-pointer",
				"touch-manipulation",
				"flex flex-row items-center gap-3 space-x-0",
				"border border-border/65",
				"hover:border-border/90",
				"bg-card",
				"p-4",
				"rounded-2xl",
				"transition-all duration-200",
				"shadow-sm",
				"has-[button[data-state='checked']]:border-info/55",
				"has-[button[data-state='checked']]:bg-info/8",
				"has-[button[data-state='checked']]:shadow-md"
			]
		}
	},
	defaultVariants: {
		variant: "default"
	}
});

const RadioItem = React.forwardRef<HTMLLabelElement, RadioItemProps>(
	({ labelProps, variant, isActive, divProps, optionProps, disabled, allowDeselect, onToggle }, ref) => {
		const value = optionProps?.value || "";
		const label = optionProps?.label || "";
		const { onClick, onKeyDown, ...safeDivProps } = divProps ?? {};

		const handleToggle = () => {
			onToggle?.(value);
		};

		return (
			<label
				ref={ref}
				htmlFor={value}
				{...safeDivProps}
				onClick={(event) => {
					if (allowDeselect && isActive) {
						event.preventDefault();
						handleToggle();
						return;
					}
					onClick?.(event);
				}}
				onKeyDown={(event) => {
					if (allowDeselect && isActive && (event.key === "Enter" || event.key === " ")) {
						event.preventDefault();
						handleToggle();
						return;
					}
					onKeyDown?.(event);
				}}
				className={cn(radioVariants({ variant }), safeDivProps?.className, {
					"border-info/60": variant === "border" && isActive,
					"pointer-events-none opacity-50": disabled
				})}
			>
				<RadioGroupItem value={value} id={value} disabled={disabled} />
				<span {...labelProps} className={cn("w-full cursor-pointer text-left", labelProps?.className)}>
					{label}
				</span>
			</label>
			);
	}
);
RadioItem.displayName = "RadioItem";

const RadioList = React.forwardRef<React.ElementRef<typeof RadioGroup>, RadioListProps>(
	({ name, options, children, radioItemProps, allowDeselect = false, ...rest }, ref) => {
		const { control } = useFormContext();
		const { field } = useController({ name, control });

		return (
			<RadioGroup
				{...rest}
				ref={ref}
				onValueChange={field.onChange}
				value={(field.value as string | undefined) ?? ""}
			>
				{children ? (
					<>{children}</>
				) : (
					options?.map(({ label, value, disabled }) => (
						<RadioItem
							{...radioItemProps}
							isActive={value === field.value}
							allowDeselect={allowDeselect}
							onToggle={() => field.onChange("")}
							key={String(value)}
							disabled={disabled}
							optionProps={{ label, value, disabled }}
						/>
					))
				)}
			</RadioGroup>
		);
	}
);
RadioList.displayName = "RadioList";

export { RadioGroup, RadioGroupItem, RadioList, RadioItem, type RadioItemProps, type RadioListProps };
