import { UserIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { CLASS_HOVER_ICON } from "@/constants";
import { routes } from "@/config";
import { cn } from "@/lib/utils";

export async function UserMenuContainer() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
		next: { tags: ["USER:CURRENT"] }
	});

	if (user) {
		return <UserMenu user={user} />;
	}

	return (
		<LinkWithChannel isKeepHref href={routes.auth.signIn} className={cn("flex", CLASS_HOVER_ICON)}>
			<UserIcon strokeWidth={1.5} className="h-5 w-5 shrink-0" aria-hidden="true" />
			<span className="hidden text-sm sm:block">Đăng nhập</span>
		</LinkWithChannel>
	);
}
