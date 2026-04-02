import { z } from "zod";
import { type GetTranslations } from "@/app/types";

const formSchema = ({ t }: { t: GetTranslations }) => {
	const emailLabel = t("login.email.label");
	const emailRequired = { message: t("formValidation.required", { field: emailLabel }) };

	return z.object({
		email: z
			.string(emailRequired)
			.nonempty(emailRequired)
			.email({ message: t("formValidation.invalidFormat", { field: emailLabel }) })
	});
};

type FormSchema = z.infer<ReturnType<typeof formSchema>>;

export { formSchema, type FormSchema };
