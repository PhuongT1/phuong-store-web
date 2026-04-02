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
		resolver: zodResolver(formSchema({ t }))
	});
	const { handleSubmit, setError } = method;

	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") ?? routes.search;
	const { trigger } = useLogin({
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
			<div className="bg-card rounded-lg p-8 shadow-sm">
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
							<Button size={"base"} variant={"default"} type="submit" className="w-full">
								<LogIn className="h-4 w-4" />
								{t("common.login")}
							</Button>
						</div>
					</div>
				</FormProvider>

				{/* Register Link */}
				<div className="border-border mt-6 border-t pt-6 text-center">
					<p className="text-muted-foreground text-sm">
						{t("common.noAccount")}{" "}
						<LinkWithChannel
							href="/sign-up"
							className="text-foreground hover:text-foreground/80 font-semibold hover:underline"
						>
							{t("common.register")}
						</LinkWithChannel>
					</p>
				</div>

				{/* Back to Store */}
				<div className="mt-4 text-center">
					<LinkWithChannel
						href="/"
						className="text-muted-foreground hover:text-foreground text-sm hover:underline"
					>
						{t("common.backToStore")}
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
};

export { SignIn };
