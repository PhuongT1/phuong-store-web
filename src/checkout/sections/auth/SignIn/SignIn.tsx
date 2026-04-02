import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { isValidEmail } from "@/checkout/lib/utils/common";
import {
	SignInFormContainer,
	type SignInFormContainerProps
} from "@/checkout/sections/auth/Contact/SignInFormContainer";
import { usePasswordResetRequest } from "@/checkout/sections/auth/SignIn/usePasswordResetRequest";
import { useSignInForm } from "@/checkout/sections/auth/SignIn/useSignInForm";
import { FormInput } from "@/components/ui/input/FormInput";
import { Button } from "@components/ui";
import { useCheckout } from "@hooks/checkout";
interface SignInProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignInSuccess: () => void;
	onEmailChange: (email: string) => void;
	email: string;
}

export const SignIn: React.FC<SignInProps> = ({
	onSectionChange,
	onSignInSuccess,
	onEmailChange: _onEmailChange,
	email: initialEmail
}) => {
	const {
		checkout: { email: checkoutEmail }
	} = useCheckout();
	const { errorMessages } = useErrorMessages();
	const [showPwd, setShowPwd] = useState(false);

	const form = useSignInForm({
		onSuccess: onSignInSuccess,
		initialEmail: initialEmail || checkoutEmail || ""
	});

	const { rhf, values: { email }, setErrors, setTouched, isSubmitting, handleSubmit } = form;

	const { onPasswordResetRequest, passwordResetSent } = usePasswordResetRequest({
		email,
		shouldAbort: async () => {
			const isValid = await isValidEmail(email);

			if (!isValid) {
				await setTouched({ email: true });
				setErrors({ email: errorMessages.emailInvalid });
				return true;
			}
			setErrors({});
			return false;
		}
	});

	return (
		<SignInFormContainer
			title="Sign in"
			redirectSubtitle="Continue as guest?"
			redirectButtonLabel="Back"
			onSectionChange={onSectionChange}
		>
			<FormProvider {...rhf}>
				<form className="grid grid-cols-1 gap-3" noValidate onSubmit={handleSubmit}>
					<FormInput
						control={rhf.control}
						name="password"
						inputProps={{
							type: showPwd ? "text" : "password",
							placeholder: "Password",
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
					<div className="flex w-full flex-row items-center justify-end">
						<Button
							variant="default"
							className="mr-4 ml-1"
							onClick={isSubmitting ? (e) => e.preventDefault() : onPasswordResetRequest}
						>
							{passwordResetSent ? "Resend?" : "Forgot password?"}
						</Button>
						<Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
							Sign in
						</Button>
					</div>
				</form>
			</FormProvider>
		</SignInFormContainer>
	);
};
