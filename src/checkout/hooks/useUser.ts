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

	return { user, loading, authenticated };
};
