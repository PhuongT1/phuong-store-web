import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@lib/utils";

const skeletonVariants = cva("animate-pulse rounded-md bg-neutral-300", {
	variants: {
		size: {
			sm: "h-4",
			md: "h-9",
			lg: "h-16"
		}
	},
	defaultVariants: {
		size: "sm"
	}
});

const Skeleton = ({
	className,
	size,
	...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>) => {
	return <div className={cn(skeletonVariants({ size, className }))} {...props} />;
};
Skeleton.displayName = "Skeleton";

export { Skeleton };
