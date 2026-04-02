import { invariant } from "ts-invariant";
import { getUserSession } from "@/auth/authSession";
import {
	type GraphQLDocument,
	type GraphQLRequestOptions,
	requestInit,
	responseData
} from "./graphQLRequest";

const fetchGraphQL = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
): Promise<Result> => {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const { shouldSendToken = true, saleorAppToken } = options;
	let accessToken: string | undefined;
	if (shouldSendToken) {
		// saleorAppToken is pre-resolved (and refreshed if needed) by serverFetchWithAuth.
		// Fall back to session for direct non-action usages.
		accessToken = saleorAppToken ?? (await getUserSession())?.accessToken ?? undefined;
	}
	const input = await requestInit(operation, options, accessToken);
	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);

	return responseData(response);
};

// Backward-compatible alias
const executeGraphQLRequest = fetchGraphQL;

export { executeGraphQLRequest, fetchGraphQL };
