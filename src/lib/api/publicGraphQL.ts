import { invariant } from "ts-invariant";
import {
	type GraphQLDocument,
	type GraphQLRequestOptions,
	requestInit,
	responseData
} from "./graphQLRequest";

const fetchPublicGraphQL = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
): Promise<Result> => {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const input = await requestInit(operation, options);
	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);

	return responseData(response);
};

const executePublicGraphQLRequest = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
): Promise<Result> => {
	try {
		return await fetchPublicGraphQL(operation, options);
	} catch (error) {
		throw error;
	}
};

export { fetchPublicGraphQL, executePublicGraphQLRequest };
