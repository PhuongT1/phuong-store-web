import React from "react";
import { useUser } from "@/checkout/hooks/useUser";
import { type SignInFormContainerProps } from "../Contact/SignInFormContainer";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignOutSuccess: () => void;
}

/**
 * SignedInUser — authenticated state marker for the Contact section.
 * Renders nothing: the email pill and sign-out action live in CheckoutForm
 * to avoid duplicate UI. This component exists only so Contact.tsx can
 * track the "signedInUser" section state and trigger onSignOutSuccess on logout.
 */
export const SignedInUser: React.FC<SignedInUserProps> = () => {
	const { user } = useUser();
	if (!user) return null;
	return null;
};
