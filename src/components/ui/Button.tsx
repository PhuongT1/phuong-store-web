"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/ui/atoms/Loader";

const buttonVariants = cva(
	"max-h-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-2px)] text-sm font-medium tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985]",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.28)] hover:bg-primary/92 hover:shadow-[0_6px_18px_-12px_rgba(0,0,0,0.38)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
				destructive:
					"bg-destructive text-destructive-foreground shadow-[0_1px_2px_rgba(0,0,0,0.10)] hover:bg-destructive/90 focus-visible:ring-destructive/30",
				"destructive-outline":
					"border border-destructive/60 bg-destructive-muted/30 text-destructive hover:bg-destructive-muted/45 focus-visible:ring-destructive/30",
				outline:
					"border border-border/75 bg-card/95 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-border hover:bg-accent/70 hover:text-accent-foreground dark:shadow-[0_1px_1px_rgba(0,0,0,0.45)]",
				secondary:
					"border border-border/65 bg-secondary/90 text-secondary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-accent/75 hover:text-accent-foreground",
				ghost: "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground",
				link: "text-primary hover:text-primary/80",
				feature: "bg-price hover:bg-price/85 text-destructive-foreground shadow-sm",
				success: "bg-success text-success-foreground hover:bg-success/85 shadow-sm",
				info: "bg-info text-info-foreground hover:bg-info/85 shadow-sm",
				select:
					"border border-border/65 bg-input shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-accent/70 hover:text-accent-foreground font-medium",
				pagination:
					"flex items-center gap-1 rounded-full border border-border/70 bg-card/95 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent/70 hover:shadow-[0_8px_18px_-14px_rgba(0,0,0,0.35)]",
				icon: "text-current focus-visible:ring-0 focus-visible:outline-none hover:bg-accent/80 hover:text-current rounded-full",
				text: "text-md"
			},
			size: {
				default: "h-10 px-5 py-2",
				sm: "h-9 rounded-[calc(var(--radius)-3px)] px-3 text-xs",
				base: "h-11 rounded-[calc(var(--radius)-2px)] px-4 text-base",
				lg: "h-12 rounded-[calc(var(--radius)-1px)] px-8 text-lg",
				icon: "h-9 w-9",
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
		<div className="border-border flex items-center justify-center gap-x-4 px-4 pt-8">
			<Button {...rest} variant="pagination" loadingColor="black">
				Xem thêm {remainingCount} kết quả
				<ChevronDown className="h-5 w-5" />
			</Button>
		</div>
	);
};
LoadMoreButton.displayName = "LoadMoreButton";

const CloseButton = ({ ...props }: ButtonProps) => {
	return (
		<Button variant={"icon"} size={"icon"} positionIcon={"end"} {...props}>
			<XIcon size={16} />
		</Button>
	);
};
CloseButton.displayName = "CloseButton";

export { Button, buttonVariants, LoadMoreButton, CloseButton, type ButtonProps };
