"use client";

import React from "react";
import { SWRConfig } from "swr";
import { GraphQLError, type GraphQLErrorResponse } from "@/lib/api/graphQLRequest";
import { notify } from "@components/ui";
import { GlobalLoading } from "./GlobalLoading";
import { SWRLoadingConfig } from "./SWRLoadingConfig";

const SWRProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SWRConfig
			value={{
				revalidateOnFocus: false,
				onError: (err) => {
					if (err && typeof err === "object" && "errors" in (err as object)) {
						const errorBody = new GraphQLError(err as GraphQLErrorResponse);
						notify.error(errorBody.message);
					} else if (err instanceof Error) {
						notify.error(err.message);
					} else {
						notify.error("Something went wrong");
					}
				},

				use: [SWRLoadingConfig]
			}}
		>
			{children}
			<GlobalLoading />
		</SWRConfig>
	);
};

export { SWRProvider };
