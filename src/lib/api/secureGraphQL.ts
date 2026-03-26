import { invariant } from "ts-invariant";
import {
	type GraphQLDocument,
	type GraphQLRequestOptions,
	requestInit,
	responseData
} from "./graphQLRequest";
import { getUserSession } from "@/auth/authSession";

const fetchGraphQL = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
): Promise<Result> => {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const { shouldSendToken = true, saleorAppToken } = options;
	let accessToken;
	if (shouldSendToken) {
		accessToken = saleorAppToken ?? (await getUserSession())?.accessToken;
	}
	const input = await requestInit(operation, options, accessToken);
	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);

	return responseData(response);
};

const executeGraphQLRequest = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
): Promise<Result> => {
	try {
		return await ((await fetchGraphQL(operation, options)) as Promise<Result>);
	} catch (error) {
		throw error;
	}
};

export { executeGraphQLRequest, fetchGraphQL };
