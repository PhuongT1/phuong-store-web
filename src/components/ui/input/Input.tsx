"use client";

import { type ReactNode, type AllHTMLAttributes } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { type FieldErrorProps } from "../FieldError";
import { FieldWrapper } from "../FieldWrapper";
import { type FieldRenderProps } from "../form/FormControl.type";
import { InputWrapper, type InputPrimitivesProps, type InputWrapperProps } from "./InputBase";

interface TextInputProps<TName extends string> extends Omit<AllHTMLAttributes<HTMLInputElement>, "label"> {
	name: TName;
	label?: ReactNode;
	addonAfter?: ReactNode;
}
type NumberProps = NumericFormatProps & Omit<InputWrapperProps, keyof NumericFormatProps>;
type InputPropsMap = {
	text: InputWrapperProps;
	number: NumberProps;
};
type BaseInputProps = {
	wrapFieldProps?: React.ComponentPropsWithoutRef<typeof FieldWrapper>;
	fieldProps?: FieldRenderProps;
} & Pick<FieldErrorProps, "error"> &
	Pick<InputWrapperProps, "affixWrapperProps">;

type InputElementProps = {
	[K in keyof InputPropsMap]: BaseInputProps & {
		type?: K;
		inputProps?: InputPropsMap[K];
	};
}[keyof InputPropsMap];

const InputField = ({
	wrapFieldProps,
	affixWrapperProps,
	inputProps,
	error,
	fieldProps,
	type = "text"
}: InputElementProps) => {
	const allowClear =
		affixWrapperProps?.allowClear && !!(fieldProps?.field.value ?? (inputProps as any)?.value);
	const errorField = error ?? fieldProps?.fieldState.error?.message;

	const renderInputByType = () => {
		switch (type) {
			case "text": {
				const { ref: inputRef, ...restInputProps } = ((inputProps as any) ?? {}) as {
					ref?: React.Ref<HTMLInputElement> | string;
				};
				const safeRef = typeof inputRef === "string" ? undefined : inputRef;

				return (
					<InputWrapper
						ref={safeRef}
						{...(restInputProps as InputPrimitivesProps)}
						{...fieldProps?.field}
						onChange={(e) => {
							(restInputProps as InputPrimitivesProps)?.onChange?.(e);
							fieldProps?.field?.onChange?.(e);
						}}
						affixWrapperProps={{
							...affixWrapperProps,
							clearButtonProps: {
								onClick: () => {
									fieldProps?.field?.onBlur?.();
									if (fieldProps?.field?.onChange) {
										fieldProps.field.onChange("");
										return;
									}
									(restInputProps as InputPrimitivesProps)?.onChange?.({
										target: { value: "" }
									} as any);
								}
							},
							allowClear
						}}
					/>
				);
			}
			case "number":
				const { min, max, ...restProps } = inputProps as NumericFormatProps;
				return (
					<NumericFormat
						allowLeadingZeros
						{...(inputProps as NumberProps)}
						{...fieldProps?.field}
						customInput={InputWrapper}
						isAllowed={(values) => {
							const { floatValue } = values;
							if (min && Number(floatValue) < Number(min)) return false;
							if (max && Number(floatValue) > Number(max)) return false;
							return true;
						}}
						onValueChange={(values, sourceInfo) => {
							restProps?.onValueChange?.(values, sourceInfo);

							const { floatValue } = values;
							fieldProps?.field.onChange(floatValue ?? undefined);
						}}
						affixWrapperProps={{
							...affixWrapperProps,
							clearButtonProps: {
								onClick: () => {
									fieldProps?.field.onChange(null);
								}
							},
							allowClear
						}}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<FieldWrapper
			{...wrapFieldProps}
			required={wrapFieldProps?.required ?? inputProps?.required}
			error={errorField}
		>
			{renderInputByType()}
		</FieldWrapper>
	);
};

export { InputField, type TextInputProps, type InputElementProps };
