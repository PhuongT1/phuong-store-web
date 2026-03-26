"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useController, useFormContext } from "react-hook-form";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleIcon } from "lucide-react";
import { Label } from "./Label";
import { cn } from "@/lib/utils";
import { type OptionList, type Option } from "@/types";

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
				"border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
				<CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
				{/* <CheckIcon className="h-3.5 w-3.5 fill-primary" /> */}
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

type RadioListProps = {
	name: string;
	children?: React.ReactNode;
	radioItemProps?: RadioItemProps;
} & OptionList<Option<string>> &
	Omit<React.ComponentPropsWithoutRef<typeof RadioGroup>, "value" | "defaultValue" | "onValueChange">;

type RadioItemProps = {
	divProps?: React.HTMLProps<HTMLDivElement>;
	optionProps?: Option<string>;
	labelProps?: React.ComponentPropsWithoutRef<typeof Label>;
	isActive?: boolean;
	disabled?: boolean;
} & VariantProps<typeof radioVariants>;

const radioVariants = cva("relative flex items-center space-x-2", {
	variants: {
		variant: {
			default: "",
			border: [
				"group",
				"cursor-pointer",
				"border",
				"border-border",
				"bg-background",
				"px-3",
				"py-2",
				"rounded-lg",
				"transition-colors duration-200",
				"hover:bg-accent",
				"has-[button[data-state='checked']]:border-foreground",
				"has-[button[data-state='checked']]:bg-accent"
			]
		}
	},
	defaultVariants: {
		variant: "default"
	}
});

const RadioItem = React.forwardRef<HTMLDivElement, RadioItemProps>(
	({ labelProps, variant, isActive, divProps, optionProps, disabled }, ref) => {
		const value = optionProps?.value || "";
		const label = optionProps?.label || "";

		return (
			<div
				ref={ref}
				{...divProps}
				className={cn(radioVariants({ variant }), {
					"border-foreground": variant === "border" && isActive,
					"pointer-events-none opacity-50": disabled
				})}
			>
				<RadioGroupItem value={value} id={value} disabled={disabled} />
				<Label
					htmlFor={value}
					{...labelProps}
					className={cn("w-full cursor-pointer text-left", labelProps?.className)}
				>
					{label}
				</Label>
			</div>
		);
	}
);
RadioItem.displayName = "RadioItem";

const RadioList = React.forwardRef<React.ElementRef<typeof RadioGroup>, RadioListProps>(
	({ name, options, children, radioItemProps, ...rest }, ref) => {
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
