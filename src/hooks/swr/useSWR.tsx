import useSWR, { type SWRConfiguration, type Key, type SWRResponse, type BareFetcher } from "swr";
import { type GraphQLErrorResponse } from "@lib/api/graphQLRequest";

/**
 * Extended SWR configuration with custom options
 * - showLoading: whether to show a loading indicator
 * - showLoadingAfterFetch: whether to show loading even after fetch starts
 */
interface SWRConfigExtended<Data = any, Error = any> extends SWRConfiguration<Data, Error> {
	showLoading?: boolean;
	showLoadingAfterFetch?: boolean;
}

/**
 * Tuple type for SWR hook parameters
 * - key: SWR cache key
 * - fetcher: function to fetch data (can be null)
 * - config: optional extended SWR config
 */
type SWRParams<Data = any, Error = any> = [
	key: Key,
	fetcher: BareFetcher<Data> | null,
	config?: SWRConfigExtended<Data, Error>
];

/**
 * Generic SWR hook interface
 * Allows specifying a default error type so that multiple instances can have different default errors
 *
 * @template DefaultError - the default error type for this hook
 */
interface SWRHook<DefaultError> {
	<Data = any, Error extends DefaultError = DefaultError>(
		...args: SWRParams<Data, Error>
	): SWRResponse<Data, Error>;
}

/**
 * SWR hook for GraphQL requests
 * Default error type is GraphQLErrorResponse
 */
const useSWRGraphQl: SWRHook<GraphQLErrorResponse> = (key, fetcher, config) => {
	return useSWR(key, fetcher, config);
};

/**
 * SWR hook for general API queries
 * Default error type is { error: string }
 */
const useSWRQuery: SWRHook<{ error: string }> = (key, fetcher, config) => {
	return useSWR(key, fetcher, config);
};

// Export types and hooks
export { type SWRConfigExtended, useSWRQuery, useSWRGraphQl };
