import { serverFetchWithAuth } from "@/action/serverFetchWithAuth";
import {
	type VariablesFromDoc,
	type GraphQLDocument,
	type GraphQLRequestOptions,
	type ResultFromDoc
} from "./graphQLRequest";
import { executeGraphQLRequest } from "./secureGraphQL";

/** Auth-error patterns that should trigger a token-less retry on public paths. */
const AUTH_ERROR_RE = /signature has expired|not authenticated|unauthenticated|invalid token/i;

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

	// withAuth: false → bypass serverFetchWithAuth.
	// Still attempts to read the session token for personalised/owner queries,
	// but if Saleor rejects the token (expired / race-condition / clock skew),
	// retry once without any token so public queries never crash through the
	// error boundary.
	try {
		return (await executeGraphQLRequest(operation, optionsHeader)) as unknown as ResultFromDoc<Doc>;
	} catch (err: unknown) {
		if (err instanceof Error && AUTH_ERROR_RE.test(err.message)) {
			// Stale or expired token in session — retry as fully unauthenticated.
			return (await executeGraphQLRequest(operation, {
				...optionsHeader,
				shouldSendToken: false
			})) as unknown as ResultFromDoc<Doc>;
		}
		throw err;
	}
};

export { executeGraphQL };
