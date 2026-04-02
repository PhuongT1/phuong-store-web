import { type ReactNode } from "react";
import { AuthProvider } from "@/components/layouts/AuthProvider";

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<>
			{/* <AuthProvider> */}
			{props.children}
			{/* </AuthProvider> */}
		</>
	);
}
