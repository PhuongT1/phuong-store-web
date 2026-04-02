import { UserIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { routes } from "@/config";
import { CLASS_HOVER_ICON } from "@/constants";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";

export async function UserMenuContainer() {
	const t = await getTranslations("nav");
	// executeGraphQL returns null when auth token is absent/expired — guard before destructuring
	const result = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
		next: { tags: ["USER:CURRENT"] }
	});
	const user = result?.me ?? null;

	if (user) {
		return <UserMenu user={user} />;
	}

	return (
		<LinkWithChannel isKeepHref href={routes.auth.signIn} className={cn("flex", CLASS_HOVER_ICON)}>
			<UserIcon strokeWidth={1.5} className="h-5 w-5 shrink-0" aria-hidden="true" />
			<span className="hidden text-sm sm:block">{t("signIn")}</span>
		</LinkWithChannel>
	);
}
