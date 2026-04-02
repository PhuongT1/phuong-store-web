import React from "react";
import { Typography } from "@ui";
import { cn } from "@/lib/utils";
import { ProductFilter } from "@components/product";

type ProductListLayoutProps = {
	children: React.ReactNode;
	className?: string;
	title?: React.ReactNode;
	textHeading?: React.ReactNode;
};

const ProductListLayout = ({ children, className, title, textHeading }: ProductListLayoutProps) => (
	<div className="min-h-screen px-3 py-6 sm:px-4 lg:px-6">
		{textHeading && (
			<Typography component={"h1"} variant={"h1"}>
				{textHeading}
			</Typography>
		)}
		{title}
		<div className={cn("mt-6 flex w-full gap-6 md:gap-8 lg:gap-10", className)}>
			<div className="hidden w-1/4 max-w-[280px] self-start md:block">
				<ProductFilter />
			</div>
			<div className="flex-1">{children}</div>
		</div>
	</div>
);
ProductListLayout.displayName = "ProductListLayout";

export { ProductListLayout };
