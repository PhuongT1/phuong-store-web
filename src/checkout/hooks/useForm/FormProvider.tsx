import { type PropsWithChildren } from "react";
import { type FormDataBase } from "@/checkout/hooks/useForm";
import { CheckoutFormContext, type FormikCompatForm } from "./useForm";

export const FormProvider = <TData extends FormDataBase>({
	form,
	children,
	className
}: PropsWithChildren<{
	form: FormikCompatForm<TData>;
	className?: string;
}>) => (
	<CheckoutFormContext.Provider value={form}>
		<form action="post" className={className} noValidate onSubmit={form.handleSubmit}>
			{children}
		</form>
	</CheckoutFormContext.Provider>
);
