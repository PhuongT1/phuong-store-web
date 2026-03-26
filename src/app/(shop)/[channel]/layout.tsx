import { type ReactNode } from "react";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { ChannelsListDocument } from "@/gql/graphql";
import { DEFAULT_CHANNEL_SLUG } from "@/constants";

export const generateStaticParams = async () => {
	// the `channels` query is protected
	// you can either hardcode the channels or use an app token to fetch the channel list here

	if (process.env.SALEOR_APP_TOKEN) {
		const channels = await executeGraphQL(ChannelsListDocument, {
			withAuth: false,
			saleorAppToken: process.env.SALEOR_APP_TOKEN
		});
		return (
			channels.channels
				?.filter((channel) => channel.isActive)
				.map((channel) => ({ channel: channel.slug })) ?? []
		);
	} else {
		return [{ channel: DEFAULT_CHANNEL_SLUG }];
	}
};

export default function ChannelLayout({ children }: { children: ReactNode }) {
	return children;
}
