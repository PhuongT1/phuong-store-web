import { FormikProvider, Form, type FormikProps } from "formik";
import { type PropsWithChildren } from "react";
import { type FormDataBase } from "@/checkout/hooks/useForm";

export const FormProvider = <TData extends FormDataBase>({
	form,
	children,
	className
}: PropsWithChildren<{
	form: FormikProps<TData>;
	className?: string;
}>) => (
	<FormikProvider value={form}>
		<Form action="post" className={className} noValidate={true} onSubmit={form.handleSubmit}>
			{children}
		</Form>
	</FormikProvider>
);
