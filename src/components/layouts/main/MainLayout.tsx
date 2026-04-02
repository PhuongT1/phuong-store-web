import { type ReactNode, Suspense } from "react";
import { DEFAULT_CHANNEL } from "@/constants";
import { Footer } from "../footer/Footer";
import { Header } from "../Header";
import { HeaderHeightSync } from "../HeaderHeightSync";
import { PageContainer } from "../PageContainer";
import { FooterSkeleton } from "../skeleton/FooterSkeleton";

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<>
			<Header channel={DEFAULT_CHANNEL} />
			<HeaderHeightSync />
			<PageContainer className="relative">{children}</PageContainer>
			<Suspense fallback={<FooterSkeleton />}>
				<Footer channel={DEFAULT_CHANNEL} />
			</Suspense>
		</>
	);
};

export { MainLayout };
