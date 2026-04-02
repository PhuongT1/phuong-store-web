import { type ReactNode } from "react";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "@assets/styles/globals.css";
import { ChatWidget } from "@/components/ai/ChatWidget";
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
			<body>
				<Providers>
					{children}
					<DraftModeNotification />
				</Providers>
				<Toaster />
				<ChatWidget />
			</body>
		</html>
	);
}
