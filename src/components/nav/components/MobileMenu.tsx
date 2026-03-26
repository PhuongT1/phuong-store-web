"use client";

import { MenuIcon } from "lucide-react";
import {
	Accordion,
	Button,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	DialogTitle,
	Sheet,
	SheetContent
} from "@ui";
import { useMobileMenu } from "./useMobileMenu";
import { getObjTypeMenu, renderMenu } from "./NavLink";
import { type NavigationMenuProps } from "./NavigationLinks";
import { CloseButton } from "./CloseButton";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { cn } from "@/lib/utils";
import { ALL_PRODUCTS_SLUG, CLASS_BG_HEADER, CLASS_HOVER_ICON } from "@/constants";
import { Logo } from "@/components/layouts/Logo";

type MobileMenuProps = NavigationMenuProps;

export const MobileMenu = ({ navLinks }: MobileMenuProps) => {
	const { openMenu, isOpen, closeMenu } = useMobileMenu();

	if (!navLinks) return <></>;

	return (
		<>
			<Sheet open={isOpen}>
				<Button variant="icon" size="icon" onClick={openMenu} className={CLASS_HOVER_ICON}>
					<MenuIcon className="h-6 w-6 shrink-0" aria-hidden />
				</Button>
				<SheetContent side={"left"} onCloseMenu={closeMenu}>
					<DialogTitle>
						<div
							className={cn(
								"sticky top-0 z-10 -m-[24px] mb-0 flex shrink-0 px-3 py-2 sm:px-8",
								CLASS_BG_HEADER
							)}
						>
							<Logo />
							<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
						</div>
					</DialogTitle>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value={`item-0`} onClick={closeMenu}>
							<AccordionTrigger isHiddenIcon>
								<LinkWithChannel className="w-full text-left" href={ALL_PRODUCTS_SLUG}>
									Tất cả sản phẩm
								</LinkWithChannel>
							</AccordionTrigger>
						</AccordionItem>
						{navLinks.menu?.items?.map((item, index) => (
							<AccordionItem value={`item-${index + 1}`} key={item.id}>
								<AccordionTrigger className="p-0" isHiddenIcon={Number(item.children?.length) === 0}>
									{Number(item.children?.length) > 0 ? (
										<>{renderMenu(item, "py-3")}</>
									) : (
										<LinkWithChannel
											className="w-full py-3 text-left"
											href={getObjTypeMenu(item).href}
											onClick={closeMenu}
										>
											{renderMenu(item)}
										</LinkWithChannel>
									)}
								</AccordionTrigger>
								{Number(item.children?.length) > 0 && (
									<AccordionContent className="flex flex-col">
										{item.children?.map((children) => (
											<LinkWithChannel
												key={children.id}
												href={getObjTypeMenu(children).href}
												className={cn(
													"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
												)}
												onClick={closeMenu}
											>
												{renderMenu(children)}
											</LinkWithChannel>
										))}
									</AccordionContent>
								)}
							</AccordionItem>
						))}
					</Accordion>
				</SheetContent>
			</Sheet>
			{/* <OpenButton onClick={openMenu} aria-controls="mobile-menu" />
			<Transition show={isOpen}>
				<Dialog onClose={closeMenu}>
					<Dialog.Panel className="fixed inset-0 z-20 flex h-dvh w-screen flex-col overflow-y-scroll bg-white">
						<Transition.Child
							className={cn("sticky top-0 z-10 flex shrink-0 px-3 py-2 sm:px-8", CLASS_BG_HEADER)}
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="bg-transparent"
							enterTo="bg-neutral-100"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="bg-neutral-100"
							leaveTo="bg-transparent"
						>
							<Logo />
							<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="opacity-0 -translate-y-3 bg-transparent"
							enterTo="opacity-100 translate-y-0 bg-white"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="opacity-100 translate-y-0 bg-white"
							leaveTo="opacity-0 -translate-y-3 bg-transparent"
						>
							<ul
								className="flex h-full flex-col divide-neutral-200 whitespace-nowrap p-3 pt-0 sm:p-8 sm:pt-0 [&>li]:py-3"
								id="mobile-menu"
							>
								{children}
							</ul>
						</Transition.Child>
					</Dialog.Panel>
				</Dialog>
			</Transition> */}
		</>
	);
};
