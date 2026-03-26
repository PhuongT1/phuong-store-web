import { type ReactNode } from "react";
import { MainProductLayout } from "@/components/layouts";

type CatalogLayoutProps = {
	children: ReactNode;
};

const CatalogLayout = ({ children }: CatalogLayoutProps) => {
	return <MainProductLayout>{children}</MainProductLayout>;
};

export default CatalogLayout;
