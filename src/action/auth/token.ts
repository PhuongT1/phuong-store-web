"use server";

import { TokenRefreshDocument } from "@/gql/graphql";
import { executePublicGraphQLRequest } from "@/lib/api/publicGraphQL";

export const getAccessTokenFromRefresh = async (refreshToken: string) => {
	try {
		const { tokenRefresh } = await executePublicGraphQLRequest(TokenRefreshDocument, {
			variables: { refreshToken },
			shouldSendToken: false
		});

		if (!tokenRefresh?.token) {
			throw new Error("Failed to refresh token");
		}
		return tokenRefresh;
	} catch (error) {
		throw error;
	}
};
