import React from "react";
import { Button } from "@components/ui";
import { useCheckout } from "@hooks/checkout";
import { PasswordInput } from "@/checkout/components/PasswordInput";
import { useSignInForm } from "@/checkout/sections/SignIn/useSignInForm";
import { usePasswordResetRequest } from "@/checkout/sections/SignIn/usePasswordResetRequest";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import {
	SignInFormContainer,
	type SignInFormContainerProps
} from "@/checkout/sections/Contact/SignInFormContainer";
import { isValidEmail } from "@/checkout/lib/utils/common";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
interface SignInProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignInSuccess: () => void;
	onEmailChange: (email: string) => void;
	email: string;
}

export const SignIn: React.FC<SignInProps> = ({
	onSectionChange,
	onSignInSuccess,
	onEmailChange,
	email: initialEmail
}) => {
	const {
		checkout: { email: checkoutEmail }
	} = useCheckout();
	const { errorMessages } = useErrorMessages();

	const form = useSignInForm({
		onSuccess: onSignInSuccess,
		initialEmail: initialEmail || checkoutEmail || ""
	});

	const {
		values: { email },
		handleChange,
		setErrors,
		setTouched,
		isSubmitting
	} = form;

	const { onPasswordResetRequest, passwordResetSent } = usePasswordResetRequest({
		email,
		shouldAbort: async () => {
			// @todo we'll use validateField once we fix it because
			// https://github.com/jaredpalmer/formik/issues/1755
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
			<FormProvider form={form}>
				<div className="grid grid-cols-1 gap-3">
					{/* <Input
						required
						name="email"
						placeholder="Email"
						onChange={(event) => {
							handleChange(event);
							onEmailChange(event.currentTarget.value);
						}}
					/> */}
					<PasswordInput name="password" label="Password" required />
					<div className="flex w-full flex-row items-center justify-end">
						<Button
							variant="default"
							className="mr-4 ml-1"
							onClick={(e) => (isSubmitting ? e.preventDefault() : onPasswordResetRequest)}
						>
							{passwordResetSent ? "Resend?" : "Forgot password?"}
						</Button>
						<Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
							Sign in
						</Button>
					</div>
				</div>
			</FormProvider>
		</SignInFormContainer>
	);
};
