import { type Metadata } from "next";
import { CurrentUserOrderListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { generatePageMetadata } from "@/lib/metadata";
import { OrdersView } from "./OrdersView";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("orders");

export default async function OrderPage() {
	const { me: user } = await executeGraphQL(CurrentUserOrderListDocument, {
		cache: "no-cache"
	});

	if (!user) {
		return null;
	}

	const orders = (user.orders?.edges ?? []).map(({ node }) => node);
	const userName = user.firstName || user.email;

	return <OrdersView orders={orders} userName={userName} />;
}
