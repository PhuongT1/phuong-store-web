"use server";

import { PasswordChangeDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

export async function changePassword(
	oldPassword: string,
	newPassword: string
): Promise<{ success: boolean; error?: string }> {
	const result = await executeGraphQL(PasswordChangeDocument, {
		variables: { oldPassword, newPassword },
		cache: "no-cache"
	});

	const errors = result.passwordChange?.errors ?? [];
	if (errors.length > 0) {
		return { success: false, error: errors[0]?.message ?? "Failed to change password" };
	}

	return { success: true };
}
