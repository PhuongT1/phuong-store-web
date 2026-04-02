"use server";

import { revalidatePath } from "next/cache";
import { AccountUpdateDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

export async function updateProfile(
	firstName: string,
	lastName: string
): Promise<{ success: boolean; error?: string }> {
	const result = await executeGraphQL(AccountUpdateDocument, {
		variables: { input: { firstName, lastName } },
		cache: "no-cache"
	});

	const errors = result.accountUpdate?.errors ?? [];
	if (errors.length > 0) {
		return { success: false, error: errors[0]?.message ?? "Update failed" };
	}

	revalidatePath("/account/profile");
	return { success: true };
}
