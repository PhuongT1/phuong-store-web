"use client";

import React from "react";
import { LinkWithChannel, type LinkWithChannelProps } from "@/components/navigation/LinkWithChannel";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui";

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
