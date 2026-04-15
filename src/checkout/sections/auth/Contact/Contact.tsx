import React, { type FC, useCallback, useEffect, useState } from "react";
import { useCustomerAttach } from "@/checkout/hooks/useCustomerAttach";
import { useUser } from "@/checkout/hooks/useUser";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { GuestUser } from "@/checkout/sections/auth/GuestUser/GuestUser";
import { SignIn } from "@/checkout/sections/auth/SignIn/SignIn";
import { ResetPassword } from "../ResetPassword/ResetPassword";
import { SignedInUser } from "../SignedInUser/SignedInUser";

type Section = "signedInUser" | "guestUser" | "signIn" | "resetPassword";

const onlyContactShownSections: Section[] = ["signIn", "resetPassword"];

interface ContactProps {
	setShowOnlyContact: (value: boolean) => void;
}

export const Contact: FC<ContactProps> = ({ setShowOnlyContact }) => {
	useCustomerAttach();
	const { user, authenticated } = useUser();
	const [email, setEmail] = useState(user?.email || "");
	const [passwordResetShown, setPasswordResetShown] = useState(false);
	const [currentSection, setCurrentSection] = useState<Section>(user ? "signedInUser" : "guestUser");

	const handleChangeSection = (section: Section) => () => {
		if (onlyContactShownSections.includes(section)) {
			setShowOnlyContact(true);
		}
		setCurrentSection(section);
	};

	const isCurrentSection = useCallback((section: Section) => currentSection === section, [currentSection]);

	const shouldShowOnlyContact = onlyContactShownSections.includes(currentSection);

	useEffect(() => {
		if (isCurrentSection("resetPassword")) {
			setPasswordResetShown(true);
		}
	}, [isCurrentSection]);

	useEffect(() => {
		const { passwordResetToken } = getQueryParams();
		if (passwordResetToken && !passwordResetShown) {
			setCurrentSection("resetPassword");
		}
	}, [passwordResetShown]);

	useEffect(() => {
		setShowOnlyContact(shouldShowOnlyContact);
	}, [currentSection, setShowOnlyContact, shouldShowOnlyContact]);

	useEffect(() => {
		if (authenticated && currentSection !== "signedInUser") {
			setCurrentSection("signedInUser");
		} else if (!authenticated && currentSection === "signedInUser") {
			setCurrentSection("guestUser");
		}
	}, [authenticated, currentSection]);

	return (
		<div>
			{isCurrentSection("guestUser") && <GuestUser email={email} />}

			{isCurrentSection("signIn") && (
				<SignIn
					onSectionChange={handleChangeSection("guestUser")}
					onSignInSuccess={handleChangeSection("signedInUser")}
					onEmailChange={setEmail}
					email={email}
				/>
			)}

			{isCurrentSection("signedInUser") && authenticated && (
				<SignedInUser
					onSectionChange={handleChangeSection("guestUser")}
					onSignOutSuccess={handleChangeSection("guestUser")}
				/>
			)}

			{isCurrentSection("resetPassword") && (
				<ResetPassword
					onSectionChange={handleChangeSection("signIn")}
					onResetPasswordSuccess={handleChangeSection("signedInUser")}
				/>
			)}
		</div>
	);
};
