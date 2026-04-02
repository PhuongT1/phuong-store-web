import { serverFetchWithAuth } from "@/action/serverFetchWithAuth";
import {
	type VariablesFromDoc,
	type GraphQLDocument,
	type GraphQLRequestOptions,
	type ResultFromDoc
} from "./graphQLRequest";
import { executeGraphQLRequest } from "./secureGraphQL";

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

	// withAuth: false → bypass serverFetchWithAuth (server action).
	// On server: getUserSession() runs the JWT callback which already handles
	// expired tokens correctly (clears accessToken to undefined on failure, so
	// no expired token is ever forwarded to Saleor).
	// On client: getUserSession() reads from the client session cookie — the user's
	// JWT must be sent for owner-protected queries (e.g. checkout belonging to a user).
	return executeGraphQLRequest(operation, optionsHeader) as unknown as Promise<ResultFromDoc<Doc>>;
};

export { executeGraphQL };
