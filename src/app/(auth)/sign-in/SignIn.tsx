"use client";

import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { revalidateCurrentUser } from "@/action/auth/auth";
import { routes } from "@/config";
import { type LoginForm } from "@/types";
import { LinkWithChannel } from "@components/navigation";
import { Button, FormInput } from "@components/ui";
import { FormProvider } from "@components/ui/form";
import { useLogin } from "@hooks/auth";
import { formSchema } from "./Schema";

const SignIn = () => {
	const t = useTranslations();

	const method = useForm<LoginForm>({
		mode: "onTouched",
		resolver: zodResolver(formSchema({ t })),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const { handleSubmit, setError } = method;

	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") ?? routes.search;
	const { trigger, isMutating } = useLogin({
		onError: (errors) => {
			errors?.map((error) => {
				setError(error?.field as keyof LoginForm, { message: error?.message }, { shouldFocus: true });
			});
		},
		onSuccess: () => {
			void revalidateCurrentUser({ callbackUrl });
		}
	});

	const onSubmit = (data: LoginForm) => {
		void trigger(data);
	};

	return (
		<div className="w-full max-w-md">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="text-foreground text-3xl font-bold">{t("login.title")}</h1>
				<p className="text-muted-foreground mt-2 text-sm">{t("login.subtitle")}</p>
			</div>

			{/* Login Form Card */}
			<div className="bg-card border-border/40 rounded-xl border p-8 shadow-md">
				<FormProvider methods={method} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
					<div className="space-y-5">
						<FormInput
							name="email"
							inputProps={{
								placeholder: t("login.email.placeholder"),
								required: true,
								className: "rounded-lg border-input py-3 focus:border-ring focus:ring-ring"
							}}
						/>
						<div className="pt-2">
							<Button size={"base"} variant={"info"} type="submit" loading={isMutating} className="w-full">
								<LogIn className="h-4 w-4" />
								{t("common.login")}
							</Button>
						</div>
					</div>
				</FormProvider>

				{/* Back to Store */}
				<div className="mt-4 text-center">
					<LinkWithChannel href="/" className="text-info hover:text-info/80 text-sm hover:underline">
						{t("common.backToStore")}
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
};

export { SignIn };
