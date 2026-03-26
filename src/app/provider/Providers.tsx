import { type ReactNode } from "react";
import { getServerSession } from "next-auth";
import { AuthProvider } from "@components/layouts";
import { Toaster } from "@components/ui";
import { SWRProvider } from "./swr/SWRProvider";
import { SessionProvider } from "./SessionProvider";
import { NextIntlProvider } from "./NextIntlProvider";
import { ThemeProvider } from "./ThemeProvider";
import { authConfig } from "@/auth/authConfig";

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
					<Toaster />
				</SessionProvider>
			</SWRProvider>
		</ThemeProvider>
	);
};
export { Providers };
