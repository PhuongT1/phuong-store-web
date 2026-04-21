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
	<div className="py-2 sm:py-3">
		{textHeading && (
			<Typography component={"h1"} variant={"h1"} className="pb-3 pt-2 sm:pb-5 sm:pt-3">
				{textHeading}
			</Typography>
		)}
		{title}
		<div className={cn("mt-3 flex w-full items-start gap-4 md:mt-4 md:gap-6", className)}>
			{/* Sticky filter sidebar — needs `self-start` so sticky works inside flex */}
			<div
				className="sticky top-[var(--header-height,88px)] hidden w-1/4 max-w-[280px] shrink-0 self-start md:block [transform:translate3d(0,calc(var(--header-shift,0px)*-1),0)] transition-transform duration-300 ease-in-out will-change-transform motion-reduce:transition-none"
				style={{ maxHeight: "calc(100vh - var(--header-height, 88px) - 16px + var(--header-shift, 0px))" }}
			>
				<ProductFilter />
			</div>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	</div>
);
ProductListLayout.displayName = "ProductListLayout";

export { ProductListLayout };
