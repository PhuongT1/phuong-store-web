"use server";

import { executeGraphQLRequest } from "@/lib/api/secureGraphQL";
import { type GraphQLDocument, type GraphQLRequestOptions } from "@/lib/api/graphQLRequest";

const serverFetchWithAuth = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
) => {
	try {
		const data = await executeGraphQLRequest(operation, options);
		return { data, errors: [] };
	} catch (error: any) {
		console.error("Server fetch error detail:", JSON.stringify(error, null, 2));
		if (error.errors) {
			return { data: null, errors: error.errors };
		}
		return { data: null, errors: [{ message: error.message || "Unknown error" }] };
	}
};

export { serverFetchWithAuth };
