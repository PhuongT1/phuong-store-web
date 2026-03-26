"use client";

import { LogOut, User } from "lucide-react";
import { DropdownMenuElement, type MenuElement } from "@components/ui";
import { UserInfo } from "./components/UserInfo";
import { UserAvatar } from "./components/UserAvatar";
import { type UserDetailsFragment } from "@/gql/graphql";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { routes } from "@/config";
import { signOutUser } from "@/auth/authActions";

type UserMenuProps = {
	user: UserDetailsFragment;
};

const UserMenu = ({ user }: UserMenuProps) => {
	const menu: MenuElement[] = [
		{
			icon: <User size={18} strokeWidth={1.5} />,
			label: (
				<LinkWithChannel isKeepHref href={routes.account.orders}>
					Lịch sử đơn hàng
				</LinkWithChannel>
			)
		},
		{
			icon: <LogOut size={18} strokeWidth={1.5} />,
			label: "Thoát tài khoản",
			onClick: () => {
				void signOutUser();
			}
		}
	];

	return (
		<DropdownMenuElement menus={menu} menuLabel={<UserInfo user={user} />}>
			<span className="sr-only">Open user menu</span>
			<UserAvatar user={user} />
		</DropdownMenuElement>
	);
};

export { UserMenu };
