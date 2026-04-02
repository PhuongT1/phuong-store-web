import { type ReactNode } from "react";

export default function RootLayout(props: { children: ReactNode; params: { channel: string } }) {
	return <>{props.children}</>;
}
