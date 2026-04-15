import { type ReactNode } from "react";
import { DEFAULT_CHANNEL } from "@/constants";
import { Header } from "@components/layouts/Header";
import { HeaderHeightSync } from "@components/layouts/HeaderHeightSync";

export default function CheckoutGroupLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header channel={DEFAULT_CHANNEL} />
			<HeaderHeightSync />
			{children}
		</>
	);
}
