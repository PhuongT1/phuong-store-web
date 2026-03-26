"use client";

import * as React from "react";
import { Check, ChevronDownIcon } from "lucide-react";
import { type VariantProps, cva } from "class-variance-authority";
import { useFloating, autoUpdate, autoPlacement } from "@floating-ui/react-dom";
import { CONFIG } from "@config/config";
import { LoadingIcon } from "@assets/icons";
import { cn, isNotNil } from "@lib/utils";
import { FieldWrapper } from "../FieldWrapper";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../Command";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { type FieldRenderProps } from "../form/FormControl.type";
import { FieldSlot } from "../FieldState";
import { AffixWrapper, type AffixWrapperProps } from "../display/AffixWrapper";
import { CloseButton } from "../Button";
import { Separator } from "../Separator";
import { type OptionList, type Option } from "@/types";

const inputVariants = cva(
	[
		"group inline-flex items-center item w-full min-w-0 overflow-hidden rounded-md border bg-transparent text-sm outline-none",
		"border-input text-foreground placeholder:text-muted-foreground transition-[color,box-shadow]",
		"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
		"selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
		"aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
		"data-[state=open]:border-focus-ring data-[state=open]:ring-focus-ring/40 data-[state=open]:ring-[2px]",
		"group-aria-[invalid=true]:border-destructive group-aria-[invalid=true]:ring-destructive/20",
		"group-aria-[invalid=true]:data-[state=open]:border-destructive group-aria-[invalid=true]:data-[state=open]:ring-destructive/20",
		"dark:group-aria-[invalid=true]:data-[state=open]:ring-destructive/40"
	],
	{
		variants: {
			variant: {
				default: "w-full items-center flex justify-between"
			},
			sizeVariant: CONFIG.SIZE_VARIANT
		},
		defaultVariants: {
			variant: "default",
			sizeVariant: "medium"
		}
	}
);

type ControlledProps<TValue> = { value?: TValue; setValue?: React.Dispatch<React.SetStateAction<TValue>> };

type ComboboxProps<TName extends string, TOption extends Option, TValue> = {
	name: TName;
	label?: React.ReactNode;
	placeholder?: string;
	fieldProps?: FieldRenderProps;
	commandItemProps?: React.ComponentPropsWithRef<typeof CommandItem>;
	isLoading?: boolean;
	fieldNames?: { label: string; value: string };
	showSearch?: boolean;
	popoverContentProps?: React.ComponentPropsWithRef<typeof PopoverContent>;
	optionRender?: (option: TOption, index: number) => React.ReactNode;
	displayTextRender?: (value: TValue, option?: TOption) => React.ReactNode;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> &
	OptionList<TOption> &
	VariantProps<typeof inputVariants> &
	AffixWrapperProps &
	ControlledProps<TValue>;

const Combobox = <TName extends string, TOption extends Option, TValue>({
	placeholder,
	options,
	label,
	required,
	fieldProps,
	commandItemProps,
	variant,
	sizeVariant = "small",
	allowClear,
	clearButtonProps,
	isLoading = false,
	fieldNames,
	showSearch,
	value,
	popoverContentProps,
	displayTextRender,
	setValue,
	optionRender
}: ComboboxProps<TName, TOption, TValue>) => {
	const isMount = React.useRef<true | undefined>(undefined);
	const [open, setOpen] = React.useState(false);
	const { refs } = useFloating({
		middleware: [
			autoPlacement({
				crossAxis: true
			})
		],
		whileElementsMounted: autoUpdate
	});

	const valueKey = (fieldNames?.value ?? "value") as keyof TOption;
	const labelKey = (fieldNames?.label ?? "label") as keyof TOption;
	const fieldValue = isNotNil(value) ? value : (fieldProps?.field.value as TValue);

	const handleChange = (currentValue: string) => {
		setOpen(false);
		fieldProps?.field.onChange(currentValue);
		setValue?.(currentValue as TValue);
	};

	const renderPlaceholder = React.useMemo(() => {
		return <span className="text-muted-foreground flex-1">{placeholder}</span>;
	}, [placeholder]);

	const removeAccents = (str: string) => {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	};

	const findLabel = () => {
		return options?.find((o) => o[valueKey] === fieldValue);
	};

	const getDisplayText = () => {
		const option = findLabel();
		if (option) {
			return option?.[labelKey];
		}
		return renderPlaceholder;
	};

	return (
		<Popover
			open={open}
			onOpenChange={(open) => {
				if (open) {
					isMount.current = true;
				}
				setOpen(open);
				fieldProps?.field.onBlur();
			}}
		>
			<FieldWrapper
				className="w-full flex-col"
				label={label}
				required={required}
				error={fieldProps?.fieldState.error?.message}
			>
				<PopoverTrigger asChild>
					<AffixWrapper
						ref={refs.setReference}
						data-name={fieldProps?.field.name}
						className={cn(inputVariants({ variant, sizeVariant }), "data-[state=open]:rounded-b-none")}
						suffix={
							<div className="flex items-center gap-2">
								{allowClear && fieldValue && (
									<>
										<CloseButton
											{...clearButtonProps}
											onClick={(e) => {
												e.stopPropagation();
												fieldProps?.field.onChange("");
												clearButtonProps?.onClick?.(e);
											}}
										/>
										<Separator orientation="vertical" className="h-5!" />
									</>
								)}
								{isLoading ? <LoadingIcon size={16} /> : <ChevronDownIcon className="size-5 opacity-40" />}
							</div>
						}
					>
						<div>
							<>{displayTextRender ? displayTextRender(fieldValue, findLabel()) : getDisplayText()}</>
						</div>
					</AffixWrapper>
				</PopoverTrigger>
			</FieldWrapper>
			<PopoverContent
				ref={refs.setFloating}
				sideOffset={0}
				className={cn(
					"w-(--radix-popover-trigger-width) overflow-hidden rounded-t-none border-t-0 p-0 data-[state=closed]:invisible data-[state=closed]:h-0",
					popoverContentProps?.className
				)}
				portalProps={{
					forceMount: isMount.current
				}}
				{...popoverContentProps}
			>
				<Command
					className="w-full md:min-w-full"
					filter={(value, search) => {
						const normalizedValue = removeAccents(value.toLowerCase());
						const normalizedSearch = removeAccents(search.toLowerCase());
						return normalizedValue.includes(normalizedSearch) ? 1 : 0;
					}}
				>
					{showSearch && <CommandInput placeholder={placeholder} className="h-9" />}
					<CommandList>
						<CommandEmpty>Không có kết quả.</CommandEmpty>
						<CommandGroup>
							{options?.map((option, index) => {
								const valueSelected = fieldValue === option[valueKey];
								return (
									<FieldSlot key={index} {...commandItemProps}>
										<CommandItem
											data-active={!!valueSelected}
											className={cn("group")}
											key={index}
											value={option[valueKey] as string}
											onSelect={() => handleChange(option[valueKey] as string)}
										>
											<>{optionRender ? optionRender(option, index) : option[labelKey]}</>
											<Check
												className={cn(
													"text-primary ml-auto h-4 w-4 opacity-0 group-data-[active=true]:opacity-100"
												)}
											/>
										</CommandItem>
									</FieldSlot>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

Combobox.displayName = "Combobox";
export { Combobox, type ComboboxProps };
