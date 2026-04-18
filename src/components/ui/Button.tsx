"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/ui/atoms/Loader";

const buttonVariants = cva(
	"max-h-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-3px)] text-sm font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55 active:scale-[0.985]",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-[0_8px_22px_-16px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.24)] hover:bg-primary/94 hover:shadow-[0_14px_28px_-18px_rgba(15,23,42,0.56)] dark:shadow-[0_10px_24px_-16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]",
				destructive:
					"bg-destructive text-destructive-foreground shadow-[0_10px_20px_-16px_rgba(190,24,93,0.55)] hover:bg-destructive/92 focus-visible:ring-destructive/30",
				"destructive-outline":
					"border border-destructive/50 bg-destructive-muted/35 text-destructive hover:bg-destructive-muted/55 focus-visible:ring-destructive/30",
				outline:
					"border border-border/70 bg-card/96 text-foreground shadow-[0_6px_16px_-14px_rgba(15,23,42,0.35)] hover:border-border/90 hover:bg-accent/82 hover:text-accent-foreground dark:shadow-[0_8px_18px_-14px_rgba(0,0,0,0.62)]",
				secondary:
					"border border-border/62 bg-secondary/92 text-secondary-foreground shadow-[0_6px_16px_-14px_rgba(15,23,42,0.3)] hover:bg-accent/80 hover:text-accent-foreground",
				ghost: "text-muted-foreground hover:bg-accent/75 hover:text-accent-foreground",
				link: "text-primary hover:text-primary/80",
				feature: "bg-price hover:bg-price/85 text-destructive-foreground shadow-sm",
				success: "bg-success text-success-foreground hover:bg-success/88 shadow-[0_10px_20px_-16px_rgba(5,150,105,0.55)]",
				info: "bg-info text-info-foreground hover:bg-info/88 shadow-[0_10px_20px_-16px_rgba(2,132,199,0.58)]",
				select:
					"border border-border/65 bg-input shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] hover:bg-accent/75 hover:text-accent-foreground font-semibold dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
				pagination:
					"flex items-center gap-1 rounded-full border border-border/70 bg-card/95 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/75 hover:shadow-[0_10px_20px_-14px_rgba(0,0,0,0.35)]",
				icon: "text-current focus-visible:ring-0 focus-visible:outline-none hover:bg-accent/80 hover:text-current rounded-full",
				text: "text-md"
			},
			size: {
				default: "h-10 px-5 py-2",
				sm: "h-9 rounded-[calc(var(--radius)-4px)] px-3 text-xs",
				base: "h-11 rounded-[calc(var(--radius)-3px)] px-4 text-base",
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
