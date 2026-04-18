import { type Metadata } from "next";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { generatePageMetadata } from "@/lib/metadata";
import { AddressView } from "./AddressView";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("address");

export default async function AddressPage() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache"
	});

	if (!user) return null;

	return <AddressView user={user} />;
}
