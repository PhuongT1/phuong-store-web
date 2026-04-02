import { type ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth/authConfig";
import { AuthProvider } from "@components/layouts";
import { NextIntlProvider } from "./NextIntlProvider";
import { SessionProvider } from "./SessionProvider";
import { SWRProvider } from "./swr/SWRProvider";
import { ThemeProvider } from "./ThemeProvider";

const Providers = async ({ children }: { children: ReactNode }) => {
	const session = await getServerSession(authConfig);

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<SWRProvider>
				<SessionProvider session={session}>
					<NextIntlProvider>
						<AuthProvider>
							<div className="flex min-h-dvh flex-col">{children}</div>
						</AuthProvider>
					</NextIntlProvider>
				</SessionProvider>
			</SWRProvider>
		</ThemeProvider>
	);
};
export { Providers };
