import { type FieldPath, type FieldValues } from "react-hook-form";
import { FormField } from "../form/FormField";
import { CheckboxItem } from "./Checkbox";

type InputItemProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<
	React.ComponentProps<typeof FormField<TFieldValues, TName>>,
	"children"
> &
	React.ComponentProps<typeof CheckboxItem>;

const FormCheckbox = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
	name,
	control,
	...rest
}: InputItemProps<TFieldValues, TName>) => {
	return (
		<FormField name={name} control={control}>
			<CheckboxItem {...rest} />
		</FormField>
	);
};

export { FormCheckbox };
