"use server";

import { UserRegisterDocument } from "@/gql/graphql";
import { executeGraphQLRequest } from "@/lib/api/secureGraphQL";
import { deriveAutoPassword } from "@/lib/auth/deriveAutoPassword";

/**
 * Registers a new user account.
 * Password is fixed "12345678" — user only needs email to login.
 * redirectUrl omitted — optional in Saleor, avoids INVALID errors on Cloud.
 */
const registerUser = async ({
	email,
	firstName = "",
	lastName = "",
	redirectUrl: _redirectUrl
}: {
	email: string;
	firstName?: string;
	lastName?: string;
	redirectUrl?: string; // kept for API compat, not passed to Saleor
}) => {
	const password = deriveAutoPassword(email);
	const channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL_SLUG ?? "default-channel";

	const data = await executeGraphQLRequest(UserRegisterDocument, {
		variables: { input: { email, password, firstName, lastName, channel } },
		cache: "no-store",
		withAuth: false,
		shouldSendToken: false
	});

	return data.accountRegister ?? null;
};

export { registerUser };

