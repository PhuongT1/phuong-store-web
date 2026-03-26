import { type ReactNode, Suspense } from "react";
import { Header } from "../Header";
import { Footer } from "../footer/Footer";
import { PageContainer } from "../PageContainer";
import { FooterSkeleton } from "../skeleton/FooterSkeleton";
import { DEFAULT_CHANNEL } from "@/constants";

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<>
			<Header channel={DEFAULT_CHANNEL} />
			<PageContainer className="relative">{children}</PageContainer>
			<Suspense fallback={<FooterSkeleton />}>
				<Footer channel={DEFAULT_CHANNEL} />
			</Suspense>
		</>
	);
};

export { MainLayout };
