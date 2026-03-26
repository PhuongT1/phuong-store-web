import { print } from "graphql";
import { REVALIDATE_TIME } from "@/constants";
import { type TypedDocumentString } from "@/gql/graphql";

type Error = {
	message: string;
}[];
type GraphQLErrorResponse = {
	errors: Error;
};

type GraphQLResponse<T> = { data: T } | GraphQLErrorResponse;
type GraphQLDocument<Result, Variables> = TypedDocumentString<Result, Variables> | string;
type VariablesGraphQL<Variables> = { variables?: Variables };
type GraphQLRequestOptions<Variables> = {
	withAuth?: boolean;
} & VariablesGraphQL<Variables> &
	Omit<RequestInit, "method" | "body"> & { saleorAppToken?: string; shouldSendToken?: boolean };

type VariablesFromDoc<Doc> = Doc extends GraphQLDocument<any, infer V> ? V : never;
type ResultFromDoc<Doc> = Doc extends GraphQLDocument<infer R, any> ? R : never;

const requestInit = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>,
	valueAccessToken?: string
) => {
	const {
		variables,
		headers,
		cache,
		next,
		withAuth,
		saleorAppToken,
		shouldSendToken = true,
		...rest
	} = options;
	const revalidate = next?.revalidate ?? REVALIDATE_TIME;
	let queryStr = "";
	if (typeof operation === "string") {
		queryStr = operation;
	} else if (typeof operation?.toString === "function") {
		queryStr = operation.toString();
	}

	const query =
		queryStr === "[object Object]" ? print(operation as unknown as import("graphql").ASTNode) : queryStr;

	let input: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(valueAccessToken && { Authorization: `Bearer ${valueAccessToken}` }),
			...headers
		},
		body: JSON.stringify({
			query,
			...(variables && { variables })
		}),
		cache,
		...rest
	};

	if (cache !== "no-cache" && cache !== "no-store") {
		input = { ...input, next: { ...next, revalidate } };
	}
	return input;
};

const responseData = async <T>(response: Response) => {
	if (!response.ok) {
		const body = await (async () => {
			try {
				return await response.text();
			} catch {
				return "";
			}
		})();
		throw new HTTPError(response, body);
	}

	const body = (await response.json()) as GraphQLResponse<T>;

	if ("errors" in body) {
		throw new GraphQLError(body);
	}

	return body.data;
};

class GraphQLError extends Error {
	constructor(public errorResponse: GraphQLErrorResponse) {
		const message =
			errorResponse.errors?.map((error: { message: string }) => error.message).join("\n") ||
			"Unknown GraphQL Error";
		super(message);

		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

class HTTPError extends Error {
	constructor(response: Response, body: string) {
		const message = `HTTP error ${response.status}: ${response.statusText}\n${body}`;
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export {
	requestInit,
	responseData,
	GraphQLError,
	HTTPError,
	type VariablesGraphQL,
	type GraphQLRequestOptions,
	type GraphQLDocument,
	type GraphQLResponse,
	type VariablesFromDoc,
	type ResultFromDoc,
	type GraphQLErrorResponse,
	type Error
};
