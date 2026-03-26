"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button, FormInput } from "@components/ui";
import { useLogin } from "@hooks/auth";
import { FormProvider } from "@components/ui/form";
import { LinkWithChannel } from "@components/navigation";
import { formSchema } from "./Schema";
import { type LoginForm } from "@/types";
import { routes } from "@/config";
import { revalidateCurrentUser } from "@/action/auth/auth";

const passwordIcons = {
	password: <EyeOff size={18} />,
	text: <Eye size={18} />
};

const SignIn = () => {
	const t = useTranslations();
	const [typePassword, setTypePassword] = useState<keyof typeof passwordIcons>("password");

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
				setError(error?.field, { message: error?.message }, { shouldFocus: true });
			});
		},
		onSuccess: () => {
			void revalidateCurrentUser({ callbackUrl });
		}
	});

	const togglePassword = () => {
		setTypePassword((prev) => (prev === "password" ? "text" : "password"));
	};

	const onSubmit = (data: LoginForm) => {
		void trigger(data);
	};

	return (
		<div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900">{t("login.title")}</h1>
					<p className="mt-2 text-sm text-gray-600">Welcome back to our store</p>
				</div>

				{/* Login Form Card */}
				<div className="rounded-lg bg-white p-8 shadow-sm">
					<FormProvider methods={method} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
						<div className="space-y-5">
							<FormInput
								name="email"
								inputProps={{
									placeholder: t("login.email.placeholder"),
									required: true,
									className: "rounded-lg border-gray-300 py-3 focus:border-gray-900 focus:ring-gray-900"
								}}
							/>
							<FormInput
								name="password"
								inputProps={{
									type: typePassword,
									required: true,
									placeholder: t("login.password.placeholder"),
									autoComplete: "current-password",
									className: "rounded-lg border-gray-300 py-3 focus:border-gray-900 focus:ring-gray-900"
								}}
								affixWrapperProps={{
									suffix: (
										<Button
											aria-label="toggle-password-visibility"
											size={"icon"}
											variant={"icon"}
											positionIcon={"end"}
											onClick={togglePassword}
											className="text-gray-400 hover:text-gray-900"
										>
											{passwordIcons[typePassword]}
										</Button>
									)
								}}
							/>
							<div className="pt-2">
								<Button
									size={"base"}
									variant={"default"}
									type="submit"
									className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800"
								>
									{t("common.login")}
								</Button>
							</div>
						</div>
					</FormProvider>

					{/* Register Link */}
					<div className="mt-6 border-t border-gray-200 pt-6 text-center">
						<p className="text-sm text-gray-600">
							{t("common.noAccount")}{" "}
							<LinkWithChannel
								href="/sign-up"
								className="font-semibold text-gray-900 hover:text-gray-700 hover:underline"
							>
								{t("common.register")}
							</LinkWithChannel>
						</p>
					</div>

					{/* Back to Store */}
					<div className="mt-4 text-center">
						<LinkWithChannel href="/" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
							← Back to store
						</LinkWithChannel>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SignIn };
