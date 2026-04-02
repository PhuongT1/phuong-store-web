import { type MenuGetBySlugQuery } from "@/gql/graphql";
import { type Channel } from "@/types";
import { NavigationLinks } from "./NavigationLinks";

type NavLinksProps = {
	navLinks: MenuGetBySlugQuery;
} & Channel;

export const NavLinks = async ({ navLinks }: NavLinksProps) => {
	return <NavigationLinks navLinks={navLinks} />;
};
