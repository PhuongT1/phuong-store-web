// import { type ImageProps } from "next/image";
import { ImageItem, type ImageItemProps } from "@components/ui";
import { cn } from "@/lib/utils";

export const ProductImageWrapper = ({ className, ...props }: ImageItemProps) => {
	return (
		<div
			className={cn(
				"align flex aspect-square items-center justify-center overflow-hidden bg-gray-50/30 mix-blend-multiply",
				"transition-transform duration-500 ease-in-out group-hover:scale-110",
				className
			)}
		>
			<ImageItem {...props} />
		</div>
	);
};
