"use client";

import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { invariant } from "ts-invariant";
import {
	type GraphQLDocument,
	type GraphQLRequestOptions,
	requestInit,
	responseData
} from "@/lib/api/graphQLRequest";

const useFetcher = () => {
	const { fetchWithAuth, ...rest } = useSaleorAuthContext();

	const fetcherGraphQL = async <Result, Variables>([operation, variables]: [
		GraphQLDocument<Result, Variables>,
		Variables
	]): Promise<Result> => {
		invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

		const init = await requestInit(String(operation), {
			variables: variables
		} as GraphQLRequestOptions<Variables>);
		const response = await fetchWithAuth(process.env.NEXT_PUBLIC_SALEOR_API_URL, init, {
			allowPassingTokenToThirdPartyDomains: true
		});
		return responseData(response);
	};

	return { fetcherGraphQL, fetchWithAuth, ...rest };
};

export { useFetcher };
