import { executeGraphQLRequest } from "./secureGraphQL";
import {
	type VariablesFromDoc,
	type GraphQLDocument,
	type GraphQLRequestOptions,
	type ResultFromDoc
} from "./graphQLRequest";

import { serverFetchWithAuth } from "@/action/serverFetchWithAuth";

const executeGraphQL = async <Doc extends GraphQLDocument<any, any>>(
	operation: Doc,
	options: GraphQLRequestOptions<VariablesFromDoc<Doc>>
): Promise<ResultFromDoc<Doc>> => {
	const { withAuth = true } = options;
	const optionsHeader = { ...options, withAuth };

	if (withAuth) {
		const result = (await serverFetchWithAuth(operation.toString(), optionsHeader)) as {
			errors?: unknown[];
			data?: unknown;
		};
		if (result.errors?.length) {
			throw new Error(JSON.stringify(result.errors)); // Re-throw to be caught by the UI
		}
		return result.data as ResultFromDoc<Doc>;
	}

	return executeGraphQLRequest(operation, optionsHeader) as unknown as Promise<ResultFromDoc<Doc>>;
};

export { executeGraphQL };
