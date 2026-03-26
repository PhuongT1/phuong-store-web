"use client";

import * as React from "react";
import { Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { type FormFieldProps } from "./FormControl.type";

const FormField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
	children,
	...controllerProps
}: FormFieldProps<TFieldValues, TName>) => {
	return (
		<Controller
			{...controllerProps}
			render={({ ...fieldProps }) =>
				React.cloneElement(children as React.ReactElement<{ fieldProps?: unknown }>, { fieldProps })
			}
		/>
	);
};

export { FormField };
