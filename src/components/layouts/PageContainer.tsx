import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MainLayoutProps = {
	children?: React.ReactNode;
	isBg?: boolean;
} & Omit<ComponentProps<"div">, "title">;

const PageContainer = ({ isBg = false, children, className, ...rest }: MainLayoutProps) => {
	const Tag = isBg ? "div" : "main";
	return (
		<Tag
			{...rest}
			className={cn("flex max-w-full flex-shrink flex-grow flex-col", { "bg-muted": isBg }, className)}
		>
			{children}
		</Tag>
	);
};

PageContainer.displayName = "MainLayout";

export { PageContainer, type MainLayoutProps };
