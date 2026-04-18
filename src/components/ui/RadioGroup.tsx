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
				"border-border/72 focus-visible:ring-focus-ring/40 relative isolate aspect-square h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] bg-background/92 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-card/88",
				"data-[state=checked]:border-info data-[state=checked]:bg-background dark:data-[state=checked]:bg-card",
				"data-[state=checked]:shadow-[0_0_0_3px_rgba(14,165,233,0.16)] dark:data-[state=checked]:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]",
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<span className="bg-info h-[8px] w-[8px] rounded-full" />
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
					"border border-border/55",
					"hover:border-border/78",
					"bg-card/94",
					"p-4",
					"rounded-2xl",
					"transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out",
					"shadow-sm",
					"has-[button[data-state='checked']]:border-info/45",
					"has-[button[data-state='checked']]:bg-info/[0.06]",
					"has-[button[data-state='checked']]:shadow-[0_10px_24px_rgba(15,23,42,0.08)]",
					"dark:has-[button[data-state='checked']]:bg-info/[0.08]",
					"dark:has-[button[data-state='checked']]:shadow-[0_10px_28px_rgba(2,8,23,0.3)]"
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
					"border-info/45 bg-info/[0.06] dark:bg-info/[0.08]": variant === "border" && isActive,
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
