"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ClipboardList, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { signOutUser } from "@/auth/authActions";
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
	const router = useRouter();
	const pathname = usePathname();

	const menu: MenuElement[] = [
		{
			icon: <ClipboardList size={18} strokeWidth={1.5} className="text-muted-foreground" />,
			label: t("accountManagement"),
			onClick: () => router.push(routes.account.profile)
		},
		{
			icon: <LogOut size={18} strokeWidth={1.5} className="text-destructive" />,
			label: t("signOut"),
			onClick: () => {
				void signOutUser({ callbackUrl: pathname ?? "/" });
			}
		}
	];

	const displayName = user.firstName ? user.firstName : user.email.split("@")[0];

	return (
		<DropdownMenuElement
			menus={menu}
			menuLabel={<UserInfo user={user} />}
			triggerClassName="h-auto md:gap-2 rounded-full p-0 md:pl-1 md:pr-2.5 md:py-1 focus:outline-none flex items-center justify-center transition-colors"
		>
			<UserAvatar user={user} />
			<span className="hidden md:inline-block max-w-[96px] truncate text-sm font-semibold">{displayName}</span>
			<ChevronDown size={15} strokeWidth={2.5} className="hidden md:block text-muted-foreground shrink-0" />
		</DropdownMenuElement>
	);
};

export { UserMenu };
