"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Pencil, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/Button";
import { FormProvider } from "@/components/ui/FormProvider";
import { FormInput } from "@/components/ui/input";
import { type CurrentUserQuery } from "@/gql/graphql";
import { updateProfile } from "./actions";

type User = NonNullable<CurrentUserQuery["me"]>;
type FormValues = { firstName: string; lastName: string };

const useSchema = (t: ReturnType<typeof useTranslations<"account">>) =>
	yup.object({
		firstName: yup.string().required(t("required")),
		lastName: yup.string().required(t("required"))
	});

export function ProfileView({ user }: { user: User }) {
	const t = useTranslations("account");
	const [editing, setEditing] = useState(false);
	const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

	const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || t("profileNoName");

	const method = useForm<FormValues>({
		mode: "onTouched",
		resolver: yupResolver(useSchema(t)),
		defaultValues: { firstName: user.firstName, lastName: user.lastName }
	});

	const onSubmit = async (values: FormValues) => {
		setFeedback(null);
		const result = await updateProfile(values.firstName, values.lastName);
		if (result.success) {
			setFeedback({ type: "success", msg: t("updateSuccess") });
			setEditing(false);
		} else {
			setFeedback({ type: "error", msg: result.error ?? t("updateError") });
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{t("profileTitle")}</h1>

			<div className="border-border bg-card overflow-hidden rounded-2xl border">
				{/* Avatar header */}
				<div className="bg-muted border-border border-b px-6 py-8">
					<div className="flex items-center gap-4">
						{user.avatar?.url ? (
							<img
								src={user.avatar.url}
								alt={user.avatar.alt ?? fullName}
								className="h-20 w-20 rounded-full object-cover"
							/>
						) : (
							<div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
								<User className="text-primary h-10 w-10" />
							</div>
						)}
						<div>
							<p className="text-foreground text-xl font-semibold">{fullName}</p>
							<p className="text-muted-foreground text-sm">{user.email}</p>
						</div>
					</div>
				</div>

				{/* Profile fields */}
				{editing ? (
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
							<div className="flex flex-col gap-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<FormInput name="firstName" wrapFieldProps={{ label: t("firstName"), required: true }} />
									<FormInput name="lastName" wrapFieldProps={{ label: t("lastName"), required: true }} />
								</div>
								<div className="flex gap-3">
									<Button type="submit" size="sm" disabled={method.formState.isSubmitting}>
										{t("save")}
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											setEditing(false);
											setFeedback(null);
										}}
									>
										{t("cancel")}
									</Button>
								</div>
							</div>
						</FormProvider>
					</div>
				) : (
					<div className="divide-border divide-y px-6">
						<div className="flex items-center justify-between py-4">
							<div>
								<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
									{t("profileName")}
								</p>
								<p className="text-foreground mt-1 font-medium">{fullName}</p>
							</div>
							<Button variant="outline" size="sm" onClick={() => setEditing(true)}>
								<Pencil className="mr-1 h-3.5 w-3.5" />
								{t("editProfile")}
							</Button>
						</div>
						<div className="flex items-center justify-between py-4">
							<div>
								<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
									{t("profileEmail")}
								</p>
								<p className="text-foreground mt-1 font-medium">{user.email}</p>
							</div>
						</div>
						{feedback && (
							<div className="py-3">
								<p
									className={`text-sm font-medium ${feedback.type === "success" ? "text-primary" : "text-destructive"}`}
								>
									{feedback.msg}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
