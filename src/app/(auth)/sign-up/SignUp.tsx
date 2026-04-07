"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { revalidateCurrentUser } from "@/action/auth/auth";
import { registerUser } from "@/action/auth/register";
import { routes } from "@/config";
import { LinkWithChannel } from "@components/navigation";
import { Button, FormInput } from "@components/ui";
import { FormProvider } from "@components/ui/form";

const registerSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().email("Địa chỉ email không hợp lệ")
});

type RegisterForm = z.infer<typeof registerSchema>;

const SignUp = () => {
	const t = useTranslations();
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const method = useForm<RegisterForm>({
		mode: "onTouched",
		resolver: zodResolver(registerSchema)
	});
	const {
		handleSubmit,
		setError,
		formState: { isSubmitting }
	} = method;

	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") ?? routes.search;

	const onSubmit = async (data: RegisterForm) => {
		const redirectUrl = `${window.location.origin}/sign-in`;

		const result = await registerUser({
			email: data.email,
			firstName: data.firstName ?? "",
			lastName: data.lastName ?? "",
			redirectUrl
		});

		if (!result) {
			setError("root", { message: "Đăng ký thất bại. Vui lòng thử lại." });
			return;
		}

		if (result.errors?.length) {
			const fieldErr = result.errors.find((e) => e.field === "email");
			if (fieldErr) {
				setError("email", { message: "Email này đã được đăng ký." });
			} else {
				const msg = result.errors.map((e) => e.message ?? e.code).join(", ");
				setError("root", {
					message: msg ?? "Đăng ký thất bại. Vui lòng thêm localhost vào Saleor Trusted Origins."
				});
			}
			return;
		}

		if (result.requiresConfirmation) {
			setSuccessMsg("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
			return;
		}

		// No confirmation needed → auto-login
		await signIn("credentials", { redirect: false, email: data.email });
		void revalidateCurrentUser({ callbackUrl });
	};

	return (
		<div className="w-full max-w-md">
			<div className="mb-8 text-center">
				<h1 className="text-foreground text-3xl font-bold">{t("signup.title")}</h1>
				<p className="text-muted-foreground mt-2 text-sm">{t("signup.subtitle")}</p>
			</div>

			<div className="bg-card border-border/40 rounded-xl border p-8 shadow-md">
				{successMsg ? (
					<div className="bg-success-muted text-success rounded-lg p-4 text-center text-sm">
						{successMsg}
						<div className="mt-4">
							<LinkWithChannel href="/sign-in" className="text-foreground font-semibold hover:underline">
								← Đăng nhập ngay
							</LinkWithChannel>
						</div>
					</div>
				) : (
					<FormProvider methods={method} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
						<div className="space-y-5">
							<div className="grid grid-cols-2 gap-4">
								<FormInput
									name="firstName"
									inputProps={{
										placeholder: t("signup.firstName"),
										className: "rounded-lg border-input py-3"
									}}
								/>
								<FormInput
									name="lastName"
									inputProps={{
										placeholder: t("signup.lastName"),
										className: "rounded-lg border-input py-3"
									}}
								/>
							</div>

							<FormInput
								name="email"
								inputProps={{
									placeholder: t("signup.email"),
									type: "email",
									required: true,
									className: "rounded-lg border-input py-3"
								}}
							/>

							{method.formState.errors.root && (
								<p className="text-destructive text-sm">{method.formState.errors.root.message}</p>
							)}

							<div className="pt-2">
								<Button
									size={"base"}
									variant={"info"}
									type="submit"
									disabled={isSubmitting}
									className="w-full"
								>
									<UserPlus className="h-4 w-4" />
									{isSubmitting ? "Đang đăng ký..." : t("signup.createAccount")}
								</Button>
							</div>
						</div>
					</FormProvider>
				)}

				<div className="border-border mt-6 border-t pt-6 text-center">
					<p className="text-muted-foreground text-sm">
						{t("signup.hasAccount")}{" "}
						<LinkWithChannel
							href="/sign-in"
							className="text-foreground hover:text-foreground/80 font-semibold hover:underline"
						>
							{t("common.login")}
						</LinkWithChannel>
					</p>
				</div>

				<div className="mt-4 text-center">
					<LinkWithChannel href="/" className="text-info hover:text-info/80 text-sm hover:underline">
						{t("common.backToStore")}
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
};

export { SignUp };
