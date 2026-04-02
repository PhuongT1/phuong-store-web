import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/action/auth";
import { deriveAutoPassword } from "@/lib/auth/deriveAutoPassword";

export const authProviders = [
	CredentialsProvider({
		credentials: {
			email: { label: "Email", type: "text" },
			password: { label: "Password", type: "password" }
		},
		async authorize(credentials) {
			if (!credentials?.email) {
				return null;
			}

			const { email } = credentials;
			// If no password provided, derive automatically from email (passwordless login)
			const password = credentials.password || deriveAutoPassword(email);

			try {
				const data = await login({ email, password });

				if (data?.errors && data.errors.length > 0) {
					throw new Error(
						JSON.stringify([{ field: "email", message: "Email không tồn tại hoặc mật khẩu không đúng." }])
					);
				}

				if (!data?.token) {
					return null;
				}

				return {
					id: "CredentialsProviderID",
					token: data.token,
					refreshToken: data.refreshToken ?? undefined,
					csrfToken: data.csrfToken ?? undefined
				};
			} catch (error) {
				// Re-throw our own errors (from error checking above)
				if (error instanceof Error && error.message.startsWith("[")) {
					throw error;
				}
				// Network/unexpected errors
				console.error("Login error:", error);
				return null;
			}
		}
	})
];
