import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@lib/utils";

const skeletonVariants = cva("animate-pulse rounded-md bg-skeleton", {
	variants: {
		size: {
			sm: "h-4",
			md: "h-9",
			lg: "h-16"
		},
		variant: {
			paragraph: "h-4",
			title: "mb-6 h-6 w-1/3"
		}
	},
	defaultVariants: {
		size: "sm"
	}
});

const Skeleton = ({
	className,
	size,
	variant,
	...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>) => {
	return <div className={cn(skeletonVariants({ size, variant, className }))} {...props} />;
};
Skeleton.displayName = "Skeleton";

export { Skeleton };
