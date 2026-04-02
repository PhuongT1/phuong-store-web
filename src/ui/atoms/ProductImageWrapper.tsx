// import { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageItem, type ImageItemProps } from "@components/ui";

export const ProductImageWrapper = ({ className, ...props }: ImageItemProps) => {
	return (
		<div
			className={cn(
					"align bg-product-image-bg flex aspect-square items-center justify-center overflow-hidden",
				"transition-transform duration-500 ease-in-out group-hover:scale-110",
				className
			)}
		>
			<ImageItem {...props} />
		</div>
	);
};
