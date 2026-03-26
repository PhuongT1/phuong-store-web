import { type Controller, type FieldPath, type FieldValues } from "react-hook-form";

type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
	children: React.ReactElement;
} & Omit<React.ComponentProps<typeof Controller<TFieldValues, TName>>, "render">;

type FieldRenderProps = Parameters<NonNullable<React.ComponentProps<typeof Controller>["render"]>>[0];

export { type FormFieldProps, type FieldRenderProps };
