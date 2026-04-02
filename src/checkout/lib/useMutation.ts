"use client";

import { useCallback, useState } from "react";
import { type TypedDocumentString } from "@/gql/graphql";
import { clientFetchGraphQL } from "@/lib/api/clientGraphQLWithRetry";

/**
 * Lightweight replacement for urql's useMutation.
 * Returns [state, executeFn] matching the old urql hook shape
 * so existing consumers (useSubmit/useFormSubmit) work unchanged.
 *
 * Uses clientFetchGraphQL for correct client-side auth with auto token refresh.
 */
export function useMutation<TResult, TVars extends Record<string, unknown>>(
	_document: TypedDocumentString<TResult, TVars>
) {
	const [state, setState] = useState<{ fetching: boolean; data: TResult | null }>({
		fetching: false,
		data: null
	});

	const execute = useCallback(
		async (variables: TVars): Promise<{ data: TResult | null; error?: unknown }> => {
			setState({ fetching: true, data: null });
			try {
				const data = await clientFetchGraphQL(_document, { variables });
				setState({ fetching: false, data: data as TResult });
				return { data: data as TResult };
			} catch (error) {
				setState({ fetching: false, data: null });
				return { data: null, error };
			}
		},
		[_document]
	);

	return [state, execute] as const;
}
