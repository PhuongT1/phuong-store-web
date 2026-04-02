"use client";

import { createContext, useCallback, useContext, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	useForm as useRHF,
	useFormContext as useRHFFormContext,
	type FieldValues,
	type Path,
	type UseFormReturn
} from "react-hook-form";
import { type FormDataBase, type FormErrors, type FormHelpers, type FormProps } from "./types";

/** Thin compatibility layer — delegates to React Hook Form internally. */
export interface FormikCompatForm<TData extends FormDataBase> {
	values: TData;
	errors: FormErrors<TData>;
	touched: Partial<Record<keyof TData, boolean>>;
	dirty: boolean;
	isSubmitting: boolean;
	isValid: boolean;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: (e: React.FocusEvent<any>) => void;
	handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
	setFieldValue: (field: keyof TData & string, value: any) => void;
	setFieldTouched: (field: keyof TData & string, isTouched?: boolean) => void;
	setFieldError: (field: keyof TData & string, message: string) => void;
	setValues: (values: TData) => void;
	setErrors: (errors: Partial<Record<keyof TData, string>>) => void;
	setTouched: (touched: Partial<Record<keyof TData, boolean>>) => Promise<void>;
	setSubmitting: (isSubmitting: boolean) => void;
	setStatus: (status: unknown) => void;
	setFormikState: (state: unknown) => void;
	validateForm: (values?: TData) => Promise<FormErrors<TData>>;
	validateField: (field: string) => Promise<void>;
	resetForm: (nextState?: { values?: TData }) => void;
	submitForm: () => Promise<void>;
	/** Underlying RHF instance — prefer using this directly in new code. */
	rhf: UseFormReturn<TData>;
}

export const useForm = <TData extends FormDataBase>(
	formProps: FormProps<TData>
): FormikCompatForm<TData> => {
	const { initialValues, validationSchema, onSubmit, initialDirty = false } = formProps;
	const onSubmitRef = useRef(onSubmit);
	onSubmitRef.current = onSubmit;

	 
	const resolver = validationSchema ? yupResolver(validationSchema) : undefined;

	const rhf = useRHF<TData>({
		defaultValues: initialValues as any,
		resolver: resolver as any,
		mode: "onBlur"
	});

	const { formState, watch, setValue, setError, clearErrors, trigger, reset, getValues } = rhf;
	const currentValues = watch();
	const errors = Object.fromEntries(
		Object.entries(formState.errors).map(([k, v]) => [k, (v as any)?.message ?? ""])
	) as FormErrors<TData>;
	const touched = Object.fromEntries(
		Object.entries(formState.touchedFields).map(([k, v]) => [k, !!v])
	) as Partial<Record<keyof TData, boolean>>;

	const dirty = initialDirty || formState.isDirty;

	const helpers = useBuildHelpers(rhf, onSubmitRef);

	return {
		values: currentValues,
		errors,
		touched,
		dirty,
		isSubmitting: formState.isSubmitting,
		isValid: formState.isValid,
		...helpers,
		rhf
	};
};

function useBuildHelpers<TData extends FormDataBase>(
	rhf: UseFormReturn<TData>,
	onSubmitRef: React.RefObject<FormProps<TData>["onSubmit"]>
): Omit<FormikCompatForm<TData>, "values" | "errors" | "touched" | "dirty" | "isSubmitting" | "isValid" | "rhf"> {
	const { setValue, setError, clearErrors, trigger, reset, getValues, handleSubmit: rhfHandleSubmit } = rhf;

	const setFieldValue = useCallback(
		(field: keyof TData & string, value: any) => setValue(field as Path<TData>, value, { shouldDirty: true }),
		[setValue]
	);
	const setFieldTouched = useCallback(
		(field: keyof TData & string, _isTouched = true) => void trigger(field as unknown as Path<TData>),
		[trigger]
	);
	const setFieldError = useCallback(
		(field: keyof TData & string, message: string) => setError(field as Path<TData>, { message }),
		[setError]
	);
	const setValues = useCallback(
		(vals: TData) => { for (const k in vals) setValue(k as unknown as Path<TData>, vals[k] as any, { shouldDirty: true }); },
		[setValue]
	);
	const setErrors = useCallback(
		(errs: Partial<Record<keyof TData, string>>) => {
			clearErrors();
			for (const [k, msg] of Object.entries(errs)) {
				if (msg) setError(k as Path<TData>, { message: msg as string });
			}
		},
		[clearErrors, setError]
	);
	const setTouched = useCallback(
		async (t: Partial<Record<keyof TData, boolean>>) => {
			for (const k of Object.keys(t)) void trigger(k as Path<TData>);
		},
		[trigger]
	);
	const setSubmitting = useCallback((_v: boolean) => { /* RHF manages this */ }, []);
	const validateForm = useCallback(
		async (vals?: TData): Promise<FormErrors<TData>> => {
			if (vals) for (const k in vals) setValue(k as unknown as Path<TData>, vals[k] as any);
			const ok = await trigger();
			if (ok) return {};
			return Object.fromEntries(
				Object.entries(rhf.formState.errors).map(([k, v]) => [k, (v as any)?.message ?? ""])
			) as FormErrors<TData>;
		},
		[setValue, trigger, rhf.formState.errors]
	);
	const validateField = useCallback(
		async (field: string) => { void trigger(field as unknown as Path<TData>); },
		[trigger]
	);
	const resetForm = useCallback(
		(next?: { values?: TData }) => reset(next?.values as any),
		[reset]
	);
	const submitForm = useCallback(async () => {
		const fn = onSubmitRef.current;
		if (!fn) return;
		await rhfHandleSubmit(async (data) => {
			const h: FormHelpers<TData> = {
				setErrors, setTouched, setValues, setSubmitting,
				setFieldValue, setFieldTouched, setFieldError,
				validateForm, validateField, resetForm, submitForm
			};
			await fn(data, h);
		})();
	}, [rhfHandleSubmit, setErrors, setTouched, setValues, setFieldValue, setFieldTouched, setFieldError, validateForm, validateField, resetForm]);
	const handleSubmit = useCallback(
		(e?: React.FormEvent<HTMLFormElement>) => { e?.preventDefault?.(); void submitForm(); },
		[submitForm]
	);
	const handleChange = useCallback(
		(e: React.ChangeEvent<any>) => {
			const { name, value, type, checked } = e.target;
			setValue(name as Path<TData>, (type === "checkbox" ? checked : value), { shouldDirty: true });
		},
		[setValue]
	);
	const handleBlur = useCallback(
		(e: React.FocusEvent<any>) => { if (e.target.name) void trigger(e.target.name as Path<TData>); },
		[trigger]
	);
	return {
		handleChange, handleBlur, handleSubmit,
		setFieldValue, setFieldTouched, setFieldError,
		setValues, setErrors, setTouched, setSubmitting,
		setStatus: () => {}, setFormikState: () => {},
		validateForm, validateField, resetForm, submitForm
	};
}

export { useRHFFormContext };

export const CheckoutFormContext = createContext<FormikCompatForm<any> | null>(null);

export const useFormContext = <TData extends FieldValues = FieldValues>(): FormikCompatForm<TData> => {
	const ctx = useContext(CheckoutFormContext);
	if (!ctx) throw new Error("useFormContext must be used within a FormProvider");
	return ctx as FormikCompatForm<TData>;
};
