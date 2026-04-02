import { type Metadata } from "next";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { generatePageMetadata } from "@/lib/metadata";
import { ProfileView } from "./ProfileView";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("account");

export default async function ProfilePage() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache"
	});

	if (!user) return null;

	return <ProfileView user={user} />;
}
