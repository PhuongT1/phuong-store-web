import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import { MainLayout } from "@components/layouts";
import { Toaster } from "@components/ui";
import { Providers } from "./provider";

import "@assets/styles/globals.css";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter"
});

export const metadata: Metadata = {
	title: "Bán hàng giá siêu rẻ",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined
};

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
			</body>
		</html>
	);
}
