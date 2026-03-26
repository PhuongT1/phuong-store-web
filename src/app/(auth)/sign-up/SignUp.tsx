"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { Button, FormInput } from "@components/ui";
import { FormProvider } from "@components/ui/form";
import { LinkWithChannel } from "@components/navigation";
import { routes } from "@/config";
import { revalidateCurrentUser } from "@/action/auth/auth";

const registerSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Please enter a valid email"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"]
	});

type RegisterForm = z.infer<typeof registerSchema>;

const passwordIcons = {
	password: <EyeOff size={18} />,
	text: <Eye size={18} />
};

const SignUp = () => {
	const t = useTranslations();
	const [typePassword, setTypePassword] = useState<keyof typeof passwordIcons>("password");

	const method = useForm<RegisterForm>({
		mode: "onTouched",
		resolver: zodResolver(registerSchema)
	});
	const { handleSubmit, setError } = method;

	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") ?? routes.search;
	const togglePassword = () => {
		setTypePassword((prev) => (prev === "password" ? "text" : "password"));
	};

	const onSubmit = async (data: RegisterForm) => {
		try {
			// TODO: Implement registration logic
			console.log("Register data:", data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// On success, redirect
			void revalidateCurrentUser({ callbackUrl });
		} catch (error) {
			setError("root", { message: "Registration failed. Please try again." });
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900">Create account</h1>
					<p className="mt-2 text-sm text-gray-600">Join us and enjoy exclusive benefits</p>
				</div>

				{/* Register Form Card */}
				<div className="rounded-lg bg-white p-8 shadow-sm">
					<FormProvider methods={method} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
						<div className="space-y-5">
							{/* Name Fields */}
							<div className="grid grid-cols-2 gap-4">
								<FormInput
									name="firstName"
									inputProps={{
										placeholder: "First name",
										required: true,
										className: "rounded-lg border-gray-300 py-3 focus:border-gray-900 focus:ring-gray-900"
									}}
								/>
								<FormInput
									name="lastName"
									inputProps={{
										placeholder: "Last name",
										required: true,
										className: "rounded-lg border-gray-300 py-3 focus:border-gray-900 focus:ring-gray-900"
									}}
								/>
							</div>

							<FormInput
								name="email"
								inputProps={{
									placeholder: "Email address",
									type: "email",
									required: true,
									className: "rounded-lg border-gray-300 py-3 focus:border-gray-900 focus:ring-gray-900"
								}}
							/>

							<FormInput
								name="password"
								inputProps={{
									type: typePassword,
									required: true,
									placeholder: "Password (at least 8 characters)",
									autoComplete: "new-password",
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

							<FormInput
								name="confirmPassword"
								inputProps={{
									type: typePassword,
									required: true,
									placeholder: "Confirm password",
									autoComplete: "new-password",
									className: "rounded-lg border-gray-300 py-3 focus:border-gray-900 focus:ring-gray-900"
								}}
							/>

							<div className="pt-2">
								<Button
									size={"base"}
									variant={"default"}
									type="submit"
									className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800"
								>
									Create account
								</Button>
							</div>
						</div>
					</FormProvider>

					{/* Login Link */}
					<div className="mt-6 border-t border-gray-200 pt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<LinkWithChannel
								href="/sign-in"
								className="font-semibold text-gray-900 hover:text-gray-700 hover:underline"
							>
								Sign in
							</LinkWithChannel>
						</p>
					</div>
				</div>

				{/* Back to Store */}
				<div className="mt-6 text-center">
					<LinkWithChannel href="/" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
						← Back to store
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
};

export { SignUp };
