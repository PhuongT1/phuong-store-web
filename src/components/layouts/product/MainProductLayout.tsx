import { ContainerLayout } from "../ContainerLayout";
import { PageContainer, type MainLayoutProps } from "../PageContainer";

type MainCategoryProps = {
	title?: React.ReactNode;
	containerClassName?: string;
	className?: string;
} & MainLayoutProps;

const MainProductLayout = ({
	children,
	title,
	isBg = false,
	containerClassName,
	className
}: MainCategoryProps) => {
	return (
		<PageContainer isBg={isBg} className={className}>
			<ContainerLayout className={containerClassName}>
				{title && <div className="pt-4 pb-8 text-3xl font-semibold">{title}</div>}
				{children}
			</ContainerLayout>
		</PageContainer>
	);
};
MainProductLayout.displayName = "MainProductLayout";

export { MainProductLayout, type MainCategoryProps };
