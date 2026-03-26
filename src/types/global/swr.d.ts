// import { BareFetcher, Fetcher, SWRGlobalConfig, PublicConfiguration } from "swr";
// import { Error as ErrorGraphql } from "@/lib/api/graphQLRequest";
// import { Key } from "react";

// declare module "swr/_internal" {
// 	interface PublicConfiguration<Data = any, Error = any, Fn extends Fetcher = BareFetcher> {
// 		showLoading?: boolean;
// 		showLoadingAfterFetch?: boolean;
// 	}
// }

import { type Key } from "swr";
import { type MutationFetcher, type SWRMutationConfiguration, type SWRMutationResponse } from "swr/mutation";

declare module "swr/mutation" {
	interface SWRMutationHook {
		<Data = any, Error = any, SWRMutationKey extends Key = Key, ExtraArg = never, SWRData = Data>(
			/**
			 * The key of the resource that will be mutated. It should be the same key
			 * used in the `useSWR` hook so SWR can handle revalidation and race
			 * conditions for that resource.
			 */
			key: SWRMutationKey,
			/**
			 * The function to trigger the mutation that accepts the key, extra argument
			 * and options. For example:
			 *
			 * ```jsx
			 * (api, data) => fetch(api, {
			 *   method: 'POST',
			 *   body: JSON.stringify(data)
			 * })
			 * ```
			 */
			fetcher: MutationFetcher<Data, SWRMutationKey, ExtraArg>,
			/**
			 * Extra options for the mutation hook.
			 */
			options?: { showLoading?: boolean } & SWRMutationConfiguration<
				Data,
				Error,
				SWRMutationKey,
				ExtraArg,
				SWRData
			> & {
					throwOnError: false;
				}
		): SWRMutationResponse<Data | undefined, Error, SWRMutationKey, ExtraArg>;
	}
}
