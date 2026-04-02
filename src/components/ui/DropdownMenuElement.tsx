"use client";

import * as React from "react";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "./DropdownMenu";

export type MenuElement = {
	icon?: React.ReactNode;
	label?: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
};

type DropdownMenuElementProps = {
	menus?: MenuElement[];
	menuLabel?: React.ReactNode;
	dropdownMenuProps?: React.ComponentPropsWithoutRef<typeof DropdownMenu>;
	dropdownMenuItemProps?: React.ComponentPropsWithoutRef<typeof DropdownMenuItem>;
	children?: React.ReactNode;
	triggerClassName?: string;
};

export const DropdownMenuElement = React.forwardRef<HTMLDivElement, DropdownMenuElementProps>(
	({ menus, menuLabel, dropdownMenuProps, dropdownMenuItemProps, children, triggerClassName }, ref) => {
		const { isOpen, toggle, setIsOpen } = useToggle();

		return (
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen} {...dropdownMenuProps}>
				<DropdownMenuTrigger asChild>
					<div
						ref={ref}
						suppressHydrationWarning
						className={cn(
							"cursor-pointer",
							"hover:bg-accent inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-full px-2.5 transition-all duration-200 active:scale-95",
							triggerClassName
						)}
					>
						{children ?? "Add text"}
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="border-border/40 mt-2 flex min-w-[8rem] flex-col gap-1 rounded-xl p-1.5 shadow-xl"
				>
					{menuLabel && (
						<>
							<DropdownMenuLabel className="text-muted-foreground px-3 py-2 text-xs font-bold tracking-wider uppercase">
								{menuLabel}
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-border my-1" />
						</>
					)}
					{menus?.map((menu, index) => (
						<React.Fragment key={index}>
							<DropdownMenuItem
								{...dropdownMenuItemProps}
								className={cn(
									"cursor-pointer rounded-lg px-3 py-2.5 transition-colors",
									menu.active && "bg-accent font-semibold"
								)}
								onClick={() => {
									toggle();
									menu?.onClick?.();
								}}
							>
								<div className="text-foreground flex items-center gap-3 font-medium">
									{menu.icon} {menu.label}
								</div>
							</DropdownMenuItem>
						</React.Fragment>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
);
DropdownMenuElement.displayName = "DropdownMenuElement";
