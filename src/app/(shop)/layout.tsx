import { type ReactNode } from "react";
import { MainLayout } from "@components/layouts";

export default async function RootLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<MainLayout>{children}</MainLayout>
		</>
	);
}
