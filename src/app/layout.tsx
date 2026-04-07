import { type ReactNode } from "react";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "@assets/styles/globals.css";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { ChatLauncherStack } from "@/components/chat/ChatLauncherStack";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { generateDefaultMetadata } from "@/lib/metadata";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { Toaster } from "@components/ui";
import { Providers } from "./provider";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter"
});

export const generateMetadata = generateDefaultMetadata;

export default async function RootLayout({ children }: { children: ReactNode }) {
	const locale = await getLocale();
	return (
		<html lang={locale} suppressHydrationWarning className={inter.variable}>
			<body className="bg-background text-foreground">
				<Providers>
					{children}
					<DraftModeNotification />
				</Providers>
				<Toaster />
				<ChatLauncherStack>
					<LiveChatWidget />
					<ChatWidget />
				</ChatLauncherStack>
			</body>
		</html>
	);
}
