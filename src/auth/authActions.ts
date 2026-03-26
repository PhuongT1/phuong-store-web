import { type SignOutParams, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { isServer } from "@/lib/utils";
import { clearAuthCookies, clearSessionToken } from "@/action/auth";

const signOutUser = async <R extends boolean = true>(options?: SignOutParams<R>) => {
	if (isServer()) {
		await clearSessionToken();
		if (options?.callbackUrl) {
			redirect(options.callbackUrl);
		}
	} else {
		await signOut(options);
		void clearAuthCookies();
	}
};

export { signOutUser };
