import { type FieldPath, type FieldValues } from "react-hook-form";
import { type Option } from "@/types";
import { FormField } from "../form/FormField";
import { Combobox, type ComboboxProps } from "./Combobox";

type FormComboboxProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	T extends Option
> = Omit<ComboboxProps<TName, T, unknown>, "name"> & {
	name: TName;
	control: import("react-hook-form").Control<TFieldValues>;
};

const FormCombobox = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	T extends Option
>({
	name,
	control,
	...rest
}: FormComboboxProps<TFieldValues, TName, T>) => {
	return (
		<FormField name={name as unknown as FieldPath<TFieldValues>} control={control}>
			<Combobox {...(rest as unknown as Omit<ComboboxProps<TName, T, unknown>, "name">)} name={name} />
		</FormField>
	);
};

export { FormCombobox };
