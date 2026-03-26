import { type NextAuthOptions } from "next-auth";
import { authProviders } from "./authProviders";
import { authCallbacks } from "./authCallbacks";
import { routes } from "@/config";

export const authConfig: NextAuthOptions = {
	pages: {
		signIn: routes.auth.signIn
	},
	providers: authProviders,
	callbacks: authCallbacks,
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`, // Cookie name
			options: {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production", // Secure cookies in production
				sameSite: "lax", // SameSite security option
				path: "/"
			}
		}
	},
	session: {
		strategy: "jwt" // Use JWT for session handling
	}
};
