"use client";

import { useState } from "react";
import { DialogTitle, Sheet, SheetContent , Button } from "@ui";
import { MenuIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/layouts/Logo";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { ALL_PRODUCTS_SLUG, CLASS_HOVER_ICON } from "@/constants";
import { cn } from "@/lib/utils";
import { CloseButton } from "./CloseButton";
import { type NavigationMenuProps } from "./NavigationLinks";
import { getObjTypeMenu } from "./NavLink";
import { useMobileMenu } from "./useMobileMenu";

type MobileMenuProps = NavigationMenuProps;

export const MobileMenu = ({ navLinks }: MobileMenuProps) => {
	const t = useTranslations("nav");
	const { openMenu, isOpen, closeMenu: handleCloseMobileMenu } = useMobileMenu();
	/** Track which accordion item is open (value = item id) */
	const [openItem, setOpenItem] = useState<string | null>(null);

	if (!navLinks) return <></>;

	const closeMenu = () => {
		setOpenItem(null); // Reset when menu closes correctly
		handleCloseMobileMenu();
	};

	const toggleItem = (id: string) => {
		setOpenItem((prev) => (prev === id ? null : id));
	};

	return (
		<>
			<Sheet
				open={isOpen}
				onOpenChange={(open) => {
					if (!open) closeMenu();
				}}
			>
				<Button variant="icon" size="icon" onClick={openMenu} className={CLASS_HOVER_ICON}>
					<MenuIcon className="h-5 w-5 shrink-0" aria-hidden />
				</Button>

				<SheetContent
					side="left"
					onCloseMenu={closeMenu}
					className="bg-background flex w-[85%] max-w-[340px] flex-col border-r-0 p-0 sm:w-80"
				>
					<DialogTitle className="sr-only">Menu</DialogTitle>

					{/* ── Sticky Header ── */}
					<div className="bg-background border-border sticky top-0 z-10 flex shrink-0 items-center justify-between border-b px-4 py-3.5">
						<Logo />
						<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
					</div>

					{/* ── Scrollable menu content ── */}
					<div id="mobile-menu" className="flex flex-1 flex-col overflow-y-auto pt-1 pb-6">
						<LinkWithChannel
							href={ALL_PRODUCTS_SLUG}
							onClick={closeMenu}
							className="hover:bg-accent text-foreground border-border/50 flex items-center justify-between border-b px-5 py-4 text-[15px] font-medium transition-colors"
						>
							{t("allProducts")}
							<ChevronRightIcon className="text-muted-foreground h-4 w-4 shrink-0" />
						</LinkWithChannel>

						{navLinks.menu?.items?.map((item) => {
							const hasChildren = Number(item.children?.length) > 0;
							const isExpanded = openItem === item.id;
							const menuObj = getObjTypeMenu(item);

							return (
								<div key={item.id} className="border-border/50 flex flex-col overflow-hidden border-b">
									{hasChildren ? (
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												toggleItem(item.id);
											}}
											className={cn(
												"flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-medium transition-colors",
												isExpanded ? "text-primary bg-accent/30" : "text-foreground hover:bg-accent"
											)}
										>
											<span>{item.name}</span>
											<ChevronRightIcon
												className={cn(
													"text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200",
													isExpanded && "text-primary rotate-90"
												)}
											/>
										</button>
									) : (
										<LinkWithChannel
											href={menuObj.href}
											onClick={closeMenu}
											className="hover:bg-accent text-foreground flex items-center justify-between px-5 py-4 text-[15px] font-medium transition-colors"
										>
											{item.name}
											<ChevronRightIcon className="text-muted-foreground h-4 w-4 shrink-0" />
										</LinkWithChannel>
									)}

									{hasChildren && isExpanded && (
										<div className="bg-muted/30 flex flex-col py-1">
											{item.children?.map((child) => {
												const childObj = getObjTypeMenu(child);
												return (
													<LinkWithChannel
														key={child.id}
														href={childObj.href}
														onClick={closeMenu}
														className="hover:bg-accent/80 text-muted-foreground hover:text-foreground flex items-center gap-2 px-6 py-3.5 text-[14px] transition-colors"
													>
														<span className="bg-border h-1.5 w-1.5 shrink-0 rounded-full" />
														{child.name}
													</LinkWithChannel>
												);
											})}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};
