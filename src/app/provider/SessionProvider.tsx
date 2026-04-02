"use client";

import { useEffect } from "react";
import { SessionProvider as SessionNextAuthProvider, useSession } from "next-auth/react";
import { signOutUser } from "@/auth/authActions";
import type { Session } from "next-auth";

const SessionWatcher = () => {
	const { data: session } = useSession();
	useEffect(() => {
		const sess = session as unknown as Record<string, string>;
		if (sess?.error === "RefreshAccessTokenError") {
			void signOutUser();
		}
	}, [session]);

	return null;
};

const SessionProvider = ({ session, children }: { session: Session | null; children: React.ReactNode }) => {
	return (
		// refetchOnWindowFocus: when user returns to tab → /api/auth/session → JWT callback → refresh token
		<SessionNextAuthProvider session={session} refetchOnWindowFocus>
			<SessionWatcher />
			{children}
		</SessionNextAuthProvider>
	);
};

export { SessionProvider };
