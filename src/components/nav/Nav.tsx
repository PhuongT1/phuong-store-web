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
			{/* Row 1: Logo, Search, Action Icons */}
			<div className="flex h-14 w-full items-center justify-between gap-x-4">
				{/* 1. Left: Mobile Menu & Logo */}
				<div className="flex min-w-max shrink-0 items-center">
					<div className="mr-1 md:hidden">
						<MobileMenu navLinks={navLinks} />
					</div>
					<Logo />
				</div>

				{/* 2. Center: Search (Primary Focus) */}
				<div className="max-w-2xl min-w-0 flex-1 px-2 md:px-4">
					<SearchBar channel={channel} />
				</div>

				{/* 3. Right: Action Icons */}
				<div className="border-border/60 flex shrink-0 items-center gap-1 border-l pl-2 sm:gap-2 lg:pl-4">
					<div className="hidden sm:block">
						<LanguageSwitcher />
					</div>
					<div className="hidden sm:block">
						<ThemeMode />
					</div>
					<Suspense fallback={<div className="bg-muted h-8 w-8 animate-pulse rounded-full" />}>
						<CartNavItem />
					</Suspense>
					<UserMenuContainer />
				</div>
			</div>

			{/* Row 2: Desktop Navigation Category Menu */}
			<div className="hidden h-12 w-full items-center justify-center md:flex">
				<NavLinks channel={channel} navLinks={navLinks} />
			</div>
		</nav>
	);
};
