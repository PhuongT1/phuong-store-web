"use client";

import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { FormField } from "../form/FormField";
import { InputField } from "./Input";

type InputItemProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<
	React.ComponentProps<typeof FormField<TFieldValues, TName>>,
	"children"
> &
	React.ComponentProps<typeof InputField>;

const FormInput = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
	name,
	control,
	...rest
}: InputItemProps<TFieldValues, TName>) => {
	const methods = useFormContext<TFieldValues, any, TFieldValues>();
	return (
		<FormField name={name} control={methods ? methods.control : control}>
			<InputField {...rest} />
		</FormField>
	);
};

export { FormInput };
