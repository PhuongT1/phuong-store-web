import { Suspense } from "react";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { type Channel } from "@/types";
import { LanguageSwitcher } from "@components/language/LanguageSwitcher";
import { Logo } from "../layouts/Logo";
import { CartNavItem } from "./components/CartNavItem";
import { MobileMenu } from "./components/MobileMenu";
import { NavLinks } from "./components/NavLinks";
import { SearchBar } from "./components/SearchBar";
import { ThemeMode } from "./components/ThemeMode";
import { UserMenuContainer } from "./components/UserMenu/UserMenuContainer";

export const Nav = async ({ channel }: Channel) => {
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar", channel }
	});

	return (
		<nav className="text-foreground flex w-full flex-col px-0 py-0" aria-label="Main navigation">
			{/* Row 1 / Header Core: Logo, Action Icons, & Desktop Search */}
			<div className="flex w-full items-center justify-between py-1.5 md:py-2.5 gap-x-2 md:gap-x-4 px-1.5 md:px-0">
				{/* 1. Left: Mobile Menu & Logo */}
				<div className="flex min-w-max shrink-0 items-center">
					<div className="mr-2 xl:hidden">
						<MobileMenu navLinks={navLinks} />
					</div>
					<Logo />
				</div>

				{/* 2. Desktop Center: Search (hidden on mobile here, moved to next row) */}
				<div className="hidden relative z-40 w-full min-w-0 flex-1 xl:block xl:max-w-2xl px-4">
					<SearchBar channel={channel} />
				</div>

				{/* 3. Right: Action Icons */}
				<div className="flex shrink-0 items-center justify-end gap-1.5 md:gap-2 border-border/60 pl-0 xl:border-l xl:pl-4 [&_svg]:max-w-[20px] md:[&_svg]:max-w-none">
					<div className="hidden sm:block">
						<LanguageSwitcher />
					</div>
					<div className="flex items-center">
						<ThemeMode />
					</div>
					<Suspense fallback={<div className="bg-accent h-7 w-7 sm:h-9 sm:w-9 animate-pulse rounded-full" />}>
						<CartNavItem />
					</Suspense>
					<UserMenuContainer />
				</div>
			</div>

			{/* Row 2 / Mobile Search Bar */}
			<div className="w-full px-1.5 pb-2 pt-0.5 xl:hidden">
				<div className="relative z-40 w-full">
					<SearchBar channel={channel} />
				</div>
			</div>

			{/* Row 2: Desktop Navigation Category Menu */}
			<div className="hidden w-full items-center justify-center xl:flex">
				<NavLinks channel={channel} navLinks={navLinks} />
			</div>
		</nav>
	);
};
