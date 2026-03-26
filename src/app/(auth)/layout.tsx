import { type ReactNode } from "react";
import { type Metadata } from "next";
import { AuthLayout } from "@components/layouts/auth-layout";

export const metadata: Metadata = {
	title: "Sign In · Saleor Storefront",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined
};

export default async function RootLayout({ children }: { children: ReactNode }) {
	return <AuthLayout>{children}</AuthLayout>;
}
