import { CurrentUserDocument, type User } from "@/gql/graphql";
import { useSWRGraphQl } from "@/hooks/swr/useSWR";
import { executeGraphQL } from "@/lib/api";

export const useUser = () => {
	const { data, isValidating: loading } = useSWRGraphQl(
		"CurrentUser",
		() => executeGraphQL(CurrentUserDocument, { withAuth: true }),
		{
			revalidateOnFocus: false
		}
	);

	const user = data?.me as User | undefined;
	const authenticated = !!user?.id;
	// True only on the very first fetch (data not yet available).
	// Does NOT become true again on background revalidation — avoids skeleton flash on refocus.
	const isInitialLoad = data === undefined && loading;

	return { user, loading, authenticated, isInitialLoad };
};
