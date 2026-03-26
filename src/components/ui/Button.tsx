"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/ui/atoms/Loader";

const buttonVariants = cva(
	"max-h-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
				destructive:
					"bg-destructive text-white hover:bg-destructive/60 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary",
				feature: "bg-price hover:bg-price/90 text-primary-foreground",
				select:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground font-normal",
				pagination:
					"item-center flex gap-1 rounded-3xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
				icon: "text-current focus-visible:ring-0 focus-visible:outline-none hover:bg-accent hover:text-current rounded-full",
				text: "text-md"
			},
			size: {
				default: "h-10 px-5 py-2",
				sm: "h-9 rounded-md px-3 text-xs",
				base: "h-11 rounded-md px-4 text-base",
				lg: "h-12 rounded-md px-8 text-lg",
				icon: "h-7 w-7",
				select: "h-9 px-3 py-2",
				link: "p-0",
				text: "px-1"
			},
			positionIcon: {
				end: "-mr-2",
				start: "-ml-2"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	}
);

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	loadingColor?: string;
	isTextButton?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			positionIcon,
			asChild = false,
			loading = false,
			children,
			disabled,
			loadingColor,
			isTextButton,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, positionIcon, className }))}
				ref={ref}
				disabled={disabled || loading}
				type="button"
				{...props}
			>
				{loading ? (
					<Loader svgProps={{ className: "h-5 w-5" }}>{!isTextButton && <> Chờ một chút...</>}</Loader>
				) : (
					<>{children}</>
				)}
			</Comp>
		);
	}
);

Button.displayName = "Button";

const LoadMoreButton = ({ remainingCount, ...rest }: ButtonProps & { remainingCount?: number }) => {
	return (
		<div className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-8">
			<Button {...rest} variant="pagination" loadingColor="black">
				Xem thêm {remainingCount} kết quả
				<ChevronDown className="h-5 w-5" />
			</Button>
		</div>
	);
};
Button.displayName = "LoadMoreButton";

const CloseButton = ({ ...props }: ButtonProps) => {
	return (
		<Button variant={"icon"} size={"icon"} positionIcon={"end"} {...props}>
			<XIcon size={16} />
		</Button>
	);
};
Button.displayName = "CloseButton";

export { Button, buttonVariants, LoadMoreButton, CloseButton, type ButtonProps };
