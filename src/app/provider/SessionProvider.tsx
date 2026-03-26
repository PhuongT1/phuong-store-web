"use client";

import type { Session } from "next-auth";
import { SessionProvider as SessionNextAuthProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { signOutUser } from "@/auth/authActions";

const SessionWatcher = () => {
	const { data: session } = useSession();
	useEffect(() => {
		const sess = session as unknown as Record<string, string>;
		if (sess && sess.error === "RefreshAccessTokenError") {
			void signOutUser();
		}
	}, [session]);

	return null;
};

const SessionProvider = ({ session, children }: { session: Session | null; children: React.ReactNode }) => {
	return (
		<SessionNextAuthProvider session={session}>
			<SessionWatcher />
			{children}
		</SessionNextAuthProvider>
	);
};

export { SessionProvider };
