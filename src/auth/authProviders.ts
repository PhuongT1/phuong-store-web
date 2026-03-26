import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/action/auth";

export const authProviders = [
	CredentialsProvider({
		credentials: {
			email: { label: "Email", type: "text" },
			password: { label: "Password", type: "password" }
		},
		async authorize(credentials) {
			const { email, password } = credentials!;
			const data = await login({ email, password });

			if (data.errors.length > 0) {
				throw new Error(JSON.stringify(data.errors));
			}
			return { ...data, id: "CredentialsProviderID" };
		}
	})
];
