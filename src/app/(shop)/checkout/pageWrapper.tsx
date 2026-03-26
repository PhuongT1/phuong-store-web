"use client";

import { Root } from "@/checkout/Root";

export const RootWrapper = ({ saleorApiUrl }: { saleorApiUrl: string }) => {
	if (!saleorApiUrl) {
		return null;
	}
	return <Root saleorApiUrl={saleorApiUrl} />;
};
