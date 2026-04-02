import { type FormErrors } from "@/checkout/hooks/useForm/types";

export const hasErrors = (formErrors: FormErrors<any> | Record<string, unknown>) =>
	!!Object.keys(formErrors).length;
