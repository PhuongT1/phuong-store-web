import { type ReactNode } from "react";
import { AuthProvider } from "@/components/layouts/AuthProvider";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor."
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<>
			{/* <AuthProvider> */}
			{props.children}
			{/* </AuthProvider> */}
		</>
	);
}
