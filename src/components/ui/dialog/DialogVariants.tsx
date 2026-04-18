import React, { type ReactNode } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { Button } from "../Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "./Dialog";

export interface AccessibleContentProps {
	fallbackText?: string;
	children: React.ReactNode;
}
/**
 * 🧩 AccessibleContent
 *
 * A utility component that ensures the wrapped element
 * always remains accessible for screen reader users.
 *
 * If the given child component (e.g., <DialogTitle /> or <DialogDescription />)
 * has **no visible text content**, it will automatically:
 *
 * - Wrap the element inside Radix's `<VisuallyHidden />`
 * - Inject the provided `fallbackText` for accessibility
 *
 * ✅ Why:
 * This pattern satisfies Radix UI's accessibility requirements:
 * every DialogContent should have a DialogTitle or a visually hidden label.
 *
 * Example:
 * ```tsx
 * <AccessibleContent fallbackText="Dialog title">
 *   <DialogTitle />
 * </AccessibleContent>
 * ```
 *
 * → Renders visually hidden fallback text when the title is empty.
 */
export function AccessibleContent({ children, fallbackText = "Title Dialog" }: AccessibleContentProps) {
	if (!React.isValidElement(children)) {
		return <>{children}</>;
	}

	const innerChildren = (children.props as Record<string, unknown>)?.children;
	const hasContent = React.Children.count(innerChildren) > 0;

	if (hasContent) {
		return children;
	}

	const element = children as React.ReactElement<{ children?: React.ReactNode } & Record<string, unknown>>;

	return <VisuallyHidden>{React.cloneElement(element, { children: fallbackText })}</VisuallyHidden>;
}
AccessibleContent.displayName = "AccessibleContent";

type BaseDialogProps = {
	dialogTitleProps?: React.ComponentPropsWithoutRef<typeof DialogTitle>;
	dialogDescriptionProps?: React.ComponentPropsWithoutRef<typeof DialogDescription>;
	confirmButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
	cancelButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
	showConfirmButton?: boolean;
	showCancelButton?: boolean;
	dialogFooterProps?: React.ComponentPropsWithoutRef<typeof DialogFooter>;
	dialogTriggerProps?: React.ComponentPropsWithoutRef<typeof DialogTrigger>;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

const BaseDialog = ({
	dialogTitleProps,
	dialogDescriptionProps,
	confirmButtonProps,
	cancelButtonProps,
	dialogFooterProps,
	showConfirmButton,
	showCancelButton,
	dialogTriggerProps,
	...rest
}: BaseDialogProps) => {
	const dialogTitleContent = dialogTitleProps?.children;
	const dialogDescriptionContent = dialogDescriptionProps?.children;
	const hasConfirmButton = !!(confirmButtonProps || showConfirmButton);
	const hasCancelButton = !!(cancelButtonProps || showCancelButton);
	const hasDialogFooter = hasConfirmButton || hasCancelButton || !!dialogFooterProps;
	return (
		<Dialog {...rest}>
			{dialogTriggerProps && <DialogTrigger asChild {...dialogTriggerProps} />}
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<AccessibleContent>
						<DialogTitle {...dialogTitleProps}>{dialogTitleContent}</DialogTitle>
					</AccessibleContent>
					{dialogDescriptionContent && (
						<DialogDescription {...dialogDescriptionProps}> {dialogDescriptionContent}</DialogDescription>
					)}
				</DialogHeader>
				{rest?.children}
				{hasDialogFooter && (
					<DialogFooter className="sm:justify-center" {...dialogFooterProps}>
						{hasConfirmButton && (
							<DialogClose asChild>
								<Button
									type="button"
									variant="default"
									className={cn("max-w-full min-w-32", confirmButtonProps?.className)}
									{...confirmButtonProps}
								>
									{confirmButtonProps?.children ?? "Confirm"}
								</Button>
							</DialogClose>
						)}
						{hasCancelButton && (
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									className={cn("max-w-full min-w-32", cancelButtonProps?.className)}
									{...cancelButtonProps}
								>
									{cancelButtonProps?.children ?? "Close"}
								</Button>
							</DialogClose>
						)}
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
};
BaseDialog.displayName = "BaseDialog";

type ConfirmDialogProps = {
	dialogTitleContent?: ReactNode;
	dialogDescriptionContent?: ReactNode;
} & Omit<BaseDialogProps, "dialogTitleProps" | "dialogDescriptionProps">;

const ConfirmDialog = ({ dialogTitleContent, dialogDescriptionContent, ...rest }: ConfirmDialogProps) => {
	return (
		<BaseDialog
			{...rest}
			dialogTitleProps={{ children: dialogTitleContent }}
			dialogDescriptionProps={{ children: dialogDescriptionContent, className: "text-card-foreground" }}
			showCancelButton
		/>
	);
};
ConfirmDialog.displayName = "ConfirmDialog";
export { BaseDialog, ConfirmDialog };
