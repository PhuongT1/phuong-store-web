"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/Button";
import { FormProvider } from "@/components/ui/FormProvider";
import { FormInput } from "@/components/ui/input";
import { changePassword } from "./actions";

type FormValues = {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const useSchema = (t: ReturnType<typeof useTranslations<"account">>) =>
	yup.object({
		oldPassword: yup.string().required(t("passwordRequired")),
		newPassword: yup.string().required(t("passwordRequired")).min(8, t("passwordMinLength")),
		confirmPassword: yup
			.string()
			.required(t("passwordRequired"))
			.oneOf([yup.ref("newPassword")], t("passwordMismatch"))
	});

export function PasswordChangeForm() {
	const t = useTranslations("account");
	const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

	const method = useForm<FormValues>({
		mode: "onTouched",
		resolver: yupResolver(useSchema(t)),
		defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
	});

	const onSubmit = async (values: FormValues) => {
		setFeedback(null);
		const result = await changePassword(values.oldPassword, values.newPassword);
		if (result.success) {
			setFeedback({ type: "success", msg: t("passwordChangeSuccess") });
			method.reset();
		} else {
			setFeedback({ type: "error", msg: result.error ?? t("passwordChangeError") });
		}
	};

	return (
		<div className="border-border bg-card overflow-hidden rounded-2xl border">
			<div className="bg-muted border-border flex items-center gap-3 border-b px-6 py-4">
				<Lock className="text-muted-foreground h-5 w-5" />
				<h2 className="text-foreground font-semibold">{t("changePassword")}</h2>
			</div>

			<div className="px-6 py-6">
				{feedback && (
					<p
						className={`mb-4 text-sm font-medium ${
							feedback.type === "success" ? "text-primary" : "text-destructive"
						}`}
					>
						{feedback.msg}
					</p>
				)}

				<FormProvider methods={method} formProps={{ onSubmit: method.handleSubmit(onSubmit) }}>
					<div className="flex flex-col gap-4 sm:max-w-sm">
						<FormInput
							name="oldPassword"
							wrapFieldProps={{ label: t("oldPassword"), required: true }}
							inputProps={{ type: "password", autoComplete: "current-password" }}
						/>
						<FormInput
							name="newPassword"
							wrapFieldProps={{ label: t("newPassword"), required: true }}
							inputProps={{ type: "password", autoComplete: "new-password" }}
						/>
						<FormInput
							name="confirmPassword"
							wrapFieldProps={{ label: t("confirmPassword"), required: true }}
							inputProps={{ type: "password", autoComplete: "new-password" }}
						/>
						<div className="pt-2">
							<Button type="submit" size="sm" disabled={method.formState.isSubmitting}>
								{t("save")}
							</Button>
						</div>
					</div>
				</FormProvider>
			</div>
		</div>
	);
}
