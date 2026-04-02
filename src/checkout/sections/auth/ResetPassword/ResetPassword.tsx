import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useResetPasswordForm } from "@/checkout/sections/auth/ResetPassword/useResetPasswordForm";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/input/FormInput";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";

interface ResetPasswordProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onResetPasswordSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSectionChange, onResetPasswordSuccess }) => {
	const [showPwd, setShowPwd] = useState(false);
	const form = useResetPasswordForm({ onSuccess: onResetPasswordSuccess });
	const { rhf, isSubmitting, handleSubmit } = form;

	return (
		<SignInFormContainer
			title="Reset password"
			redirectSubtitle="Remembered your password?"
			redirectButtonLabel="Sign in"
			onSectionChange={onSectionChange}
			subtitle="Provide a new password for your account"
		>
			<FormProvider {...rhf}>
				<form noValidate onSubmit={handleSubmit}>
					<FormInput
						control={rhf.control}
						name="password"
						inputProps={{
							type: showPwd ? "text" : "password",
							placeholder: "New password",
							required: true
						}}
						affixWrapperProps={{
							suffix: (
								<button
									type="button"
									onClick={() => setShowPwd((v) => !v)}
									className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
									aria-label={showPwd ? "Hide password" : "Show password"}
								>
									{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							)
						}}
					/>
					<div className="mt-4 flex w-full flex-row items-center justify-end">
						<Button aria-label="Reset password" type="submit" loading={isSubmitting} disabled={isSubmitting}>
							Reset password
						</Button>
					</div>
				</form>
			</FormProvider>
		</SignInFormContainer>
	);
};
