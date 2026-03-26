import { type ReactNode } from "react";
import { type Metadata } from "next";
import { MainLayout } from "@components/layouts";

export const metadata: Metadata = {
	title: "Bán hàng giá siêu rẻ",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined
};

export default async function RootLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<MainLayout>{children}</MainLayout>
		</>
	);
}
