"use client";

import * as React from "react";
import { type FieldValues, type FormProviderProps, FormProvider as RHFProvider } from "react-hook-form";

type FormProviderPropsNew<
	TFieldValues extends FieldValues = FieldValues,
	TContext = any,
	TTransformedValues = TFieldValues
> = {
	methods: Omit<FormProviderProps<TFieldValues, TContext, TTransformedValues>, "children">;
	formProps?: React.ComponentProps<"form">;
};

const FormProvider = <TFieldValues extends FieldValues, TContext, TTransformedValues>({
	formProps,
	methods,
	children
}: React.PropsWithChildren<FormProviderPropsNew<TFieldValues, TContext, TTransformedValues>>) => {
	return (
		<RHFProvider {...methods}>
			<form noValidate {...formProps}>
				{children}
			</form>
		</RHFProvider>
	);
};

export { FormProvider };
