import { type DebouncedFunc } from "lodash-es";
import { type FormSubmitFn } from "@/checkout/hooks/useFormSubmit";

export type FormDataBase = Record<string, any>;
export type FormErrors<TData extends FormDataBase> = Partial<Record<keyof TData, string>>;
export type FormDataField<TData extends FormDataBase> = Extract<keyof TData, string>;

export type FormProps<TData extends FormDataBase> = {
	initialValues: TData;
	onSubmit?:
		| FormSubmitFn<TData>
		| ((data: TData, helpers?: FormHelpers<TData>) => Promise<void>)
		| DebouncedFunc<(data: TData, helpers?: FormHelpers<TData>) => Promise<void>>;
	initialDirty?: boolean;
	validationSchema?: any;
};

export type FormHelpers<TData extends FormDataBase> = {
	setErrors: (errors: Partial<Record<keyof TData, string>>) => void;
	setTouched: (touched: Partial<Record<keyof TData, boolean>>) => Promise<void>;
	setValues: (values: TData) => void;
	setSubmitting: (isSubmitting: boolean) => void;
	setFieldValue: (field: keyof TData & string, value: any) => void;
	setFieldTouched: (field: keyof TData & string, isTouched?: boolean) => void;
	setFieldError: (field: keyof TData & string, message: string) => void;
	validateForm: (values?: TData) => Promise<FormErrors<TData>>;
	validateField: (field: keyof TData & string) => Promise<void>;
	resetForm: (nextValues?: { values?: TData }) => void;
	submitForm: () => Promise<void>;
};

export type ChangeHandler = (e: React.ChangeEvent<any>) => void;
export type BlurHandler = (e: React.FocusEvent<any>) => void;
