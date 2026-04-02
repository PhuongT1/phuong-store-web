import { type ReactNode } from "react";
import { AuthLayout } from "@components/layouts/auth-layout";

export default async function RootLayout({ children }: { children: ReactNode }) {
	return <AuthLayout>{children}</AuthLayout>;
}
