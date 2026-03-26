"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type ComponentProps, useEffect, useState } from "react";
import { DEFAULT_CHANNEL } from "@/constants";

export type LinkWithHref = { href: string };
export type LinkWithChannelProps = Omit<ComponentProps<typeof Link>, "href"> &
	LinkWithHref & {
		isKeepHref?: boolean;
	};

export const LinkWithChannel = ({ href, isKeepHref = false, ...props }: LinkWithChannelProps) => {
	const params = useParams<{ channel?: string }>();
	const channel = params?.channel;
	const [clientChannel, setClientChannel] = useState<string | null>(DEFAULT_CHANNEL);

	useEffect(() => {
		if (channel) {
			setClientChannel(channel);
		}
	}, [channel]);

	// If the href does not start with "/", return the original Link
	if (!href.startsWith("/") || href.indexOf(DEFAULT_CHANNEL) > -1 || isKeepHref) {
		return <Link {...props} href={href} passHref />;
	}

	// If the clientChannel is not available yet, render the Link with the original href to avoid hydration issues.
	const hrefWithChannel = clientChannel ? `/${encodeURIComponent(clientChannel)}${href}` : href;

	return <Link {...props} href={hrefWithChannel} passHref />;
};
