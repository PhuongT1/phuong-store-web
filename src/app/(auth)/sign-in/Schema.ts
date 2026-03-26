import { z } from "zod";
import { type GetTranslations } from "@/app/types";

const formSchema = ({ t }: { t: GetTranslations }) => {
	const emailLabel = t("login.email.label");
	const passwordLabel = t("login.password.label");
	const emailRequired = { message: t("formValidation.required", { field: emailLabel }) };
	const passwordRequired = { message: t("formValidation.required", { field: passwordLabel }) };

	return z.object({
		email: z
			.string(emailRequired)
			.nonempty(emailRequired)
			.email({ message: t("formValidation.invalidFormat", { field: emailLabel }) }),
		password: z
			.string(passwordRequired)
			.nonempty(passwordRequired)
			.min(8, t("formValidation.minLength", { minimum: 8, field: passwordLabel }))
	});
};

type FormSchema = z.infer<ReturnType<typeof formSchema>>;

export { formSchema, type FormSchema };
