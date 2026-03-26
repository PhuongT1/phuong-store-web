import { type ReactNode, memo } from "react";

type SkeletonBoundaryProps = {
	/** Nếu true, hiển thị skeleton, ngược lại hiển thị children */
	isLoading?: boolean;
	/** Skeleton component hiển thị khi loading */
	skeleton?: ReactNode;
	children: ReactNode | (() => ReactNode);
};

const SkeletonBoundary = memo(({ isLoading = false, skeleton = null, children }: SkeletonBoundaryProps) => {
	if (isLoading) return <>{skeleton}</>;

	// Nếu children là function, gọi nó, ngược lại render như bình thường
	return typeof children === "function" ? children() : <>{children}</>;
});

SkeletonBoundary.displayName = "SkeletonBoundary";

export { SkeletonBoundary };
