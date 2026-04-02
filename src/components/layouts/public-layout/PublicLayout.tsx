import { type ReactNode, Suspense } from "react";
import { DEFAULT_CHANNEL } from "@/constants";
import { Footer } from "../footer/Footer";
import { PageContainer } from "../PageContainer";
import { FooterSkeleton } from "../skeleton/FooterSkeleton";
import { HeaderPublicLayout } from "./HeaderPublicLayout";

interface PublicLayout {
	children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayout) => {
	return (
		<>
			<HeaderPublicLayout />
			<PageContainer className="relative">{children}</PageContainer>
			<Suspense fallback={<FooterSkeleton />}>
				<Footer channel={DEFAULT_CHANNEL} />
			</Suspense>
		</>
	);
};

export { PublicLayout };
