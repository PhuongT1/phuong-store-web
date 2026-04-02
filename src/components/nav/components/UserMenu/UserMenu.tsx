"use client";

import { LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { signOutUser } from "@/auth/authActions";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { routes } from "@/config";
import { type UserDetailsFragment } from "@/gql/graphql";
import { DropdownMenuElement, type MenuElement } from "@components/ui";
import { UserAvatar } from "./components/UserAvatar";
import { UserInfo } from "./components/UserInfo";

type UserMenuProps = {
	user: UserDetailsFragment;
};

const UserMenu = ({ user }: UserMenuProps) => {
	const t = useTranslations("nav");
	const menu: MenuElement[] = [
		{
			icon: <User size={18} strokeWidth={1.5} />,
			label: (
				<LinkWithChannel isKeepHref href={routes.account.orders}>
					{t("orderHistory")}
				</LinkWithChannel>
			)
		},
		{
			icon: <LogOut size={18} strokeWidth={1.5} />,
			label: t("signOut"),
			onClick: () => {
				void signOutUser();
			}
		}
	];

	return (
		<DropdownMenuElement menus={menu} menuLabel={<UserInfo user={user} />} triggerClassName="h-9 w-9 p-0">
			<span className="sr-only">Open user menu</span>
			<UserAvatar user={user} />
		</DropdownMenuElement>
	);
};

export { UserMenu };
