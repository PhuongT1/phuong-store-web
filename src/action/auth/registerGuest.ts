"use server";

import { UserRegisterDocument } from "@/gql/graphql";
import { executeGraphQLRequest } from "@/lib/api/secureGraphQL";
import { deriveAutoPassword } from "@/lib/auth/deriveAutoPassword";

/**
 * Registers a guest user with auto-derived password (no user input needed).
 * Called from checkout when "Tạo tài khoản" is checked.
 * redirectUrl is omitted — it’s optional in Saleor and causes INVALID errors on Cloud.
 */
const registerGuestUser = async ({
	email,
	channel
}: {
	email: string;
	channel: string;
	redirectUrl?: string; // kept for API compat, not used
}) => {
	const password = deriveAutoPassword(email);

	const data = await executeGraphQLRequest(UserRegisterDocument, {
		variables: { input: { email, password, channel } },
		cache: "no-store",
		withAuth: false,
		shouldSendToken: false
	});

	const result = data.accountRegister ?? null;
	if (result?.errors?.length) {
		const isUnique = result.errors.some((e) => String(e.code) === "UNIQUE");
		if (!isUnique) {
			console.error("[registerGuestUser] Saleor accountRegister errors:", result.errors);
		}
	}
	return result;
};

export { registerGuestUser };

