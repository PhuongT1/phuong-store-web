"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

import { Label } from "../Label";
import { type FieldRenderProps } from "../form/FormControl.type";
import { cn } from "@/lib/utils";
import { type Option } from "@/types";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
			<CheckIcon className="h-4 w-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

type CheckboxItemProps = {
	name?: string;
	fieldProps?: FieldRenderProps;
} & Pick<Option, "label"> &
	React.ComponentPropsWithoutRef<typeof Checkbox>;

const CheckboxItem = React.forwardRef<HTMLDivElement, CheckboxItemProps>(
	({ className, name: nameCheckbox, label, fieldProps, onCheckedChange, ...rest }, _ref) => {
		const name = fieldProps?.field.name ?? nameCheckbox;
		 
		const checked = fieldProps?.field.value ?? rest.checked;
		return (
			<div className="inline-flex items-center space-x-2">
				<Checkbox
					{...rest}
					id={name}
					onCheckedChange={(value) => {
						onCheckedChange?.(value);
						 
						fieldProps?.field.onChange(value);
					}}
					 
					checked={checked}
				/>
				<Label htmlFor={name}>{label}</Label>
			</div>
		);
	}
);
CheckboxItem.displayName = "CheckboxItem";

export { Checkbox, CheckboxItem };
