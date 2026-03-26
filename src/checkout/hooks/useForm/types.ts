import {
	type FormikHandlers,
	type FormikConfig,
	type FormikErrors,
	type FormikHelpers,
	type FormikValues,
	type FormikProps
} from "formik";
import { type DebouncedFunc } from "lodash-es";
import { type FormSubmitFn } from "@/checkout/hooks/useFormSubmit";

export type FormDataBase = FormikValues;
export type FormErrors<TData extends FormikValues> = FormikErrors<TData>;
export type FormDataField<TData extends FormDataBase> = Extract<keyof TData, string>;
export type FormProps<TData extends FormDataBase> = Omit<
	FormikConfig<TData>,
	"validationSchema" | "onSubmit"
> & {
	onSubmit?:
		| FormSubmitFn<TData>
		| ((data: TData, helpers?: FormHelpers<TData>) => Promise<void>)
		| DebouncedFunc<(data: TData, helpers?: FormHelpers<TData>) => Promise<void>>;
	initialDirty?: boolean;
	// FIXME: because there seems to be something weird going on with the type
	// yup returns when schema has some uncommon typings
	validationSchema?: any; // Schema<TData> | ObjectSchema<TData>;
};

export type FormHelpers<TData extends FormDataBase> = Omit<
	FormikHelpers<TData>,
	"validateForm" | "setTouched"
> &
	Pick<FormikProps<TData>, "validateForm" | "setTouched">;

export type ChangeHandler = FormikHandlers["handleChange"];
export type BlurHandler = FormikHandlers["handleBlur"];
