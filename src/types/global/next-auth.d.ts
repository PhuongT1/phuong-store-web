import { type DefaultSession, type DefaultUser } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

interface JsonWebToken {
	accessToken?: string;
	refreshToken?: string;
	token?: string;
}

declare module "next-auth" {
	interface Session extends DefaultSession, JsonWebToken {}
	interface User extends DefaultUser, JsonWebToken {}
	interface Session extends Record<string, unknown> {}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT, JsonWebToken {}
}
