"use client";

import React from "react";
import { Button } from "@components/ui";
import { cn } from "@/lib/utils";
import { LinkWithChannel, type LinkWithChannelProps } from "@/components/navigation/LinkWithChannel";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
	children?: React.ReactNode;
} & Pick<LinkWithChannelProps, "className" | "isKeepHref"> &
	Partial<Pick<LinkWithChannelProps, "href">>;

const ButtonLink = ({ checkoutId, className, href, children, ...rest }: Props) => {
	return (
		<Button className={cn("w-full", className)} variant={"default"} size={"lg"}>
			<LinkWithChannel {...rest} href={href ?? `/checkout?checkout=${checkoutId}`}>
				{children ?? "Đi đến đặt hàng"}
			</LinkWithChannel>
		</Button>
	);
};

export { ButtonLink };
