"use server";

import { revalidatePath } from "next/cache";
import {
	UserAddressCreateDocument,
	UserAddressUpdateDocument,
	UserAddressDeleteDocument,
	type AddressInput
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

export async function createAddress(input: AddressInput): Promise<{ success: boolean; error?: string }> {
	const result = await executeGraphQL(UserAddressCreateDocument, {
		variables: { input },
		cache: "no-cache"
	});

	const errors = result.accountAddressCreate?.errors ?? [];
	if (errors.length > 0) {
		return { success: false, error: errors[0]?.message ?? "Failed to create address" };
	}

	revalidatePath("/account/address");
	return { success: true };
}

export async function updateAddress(
	id: string,
	input: AddressInput
): Promise<{ success: boolean; error?: string }> {
	const result = await executeGraphQL(UserAddressUpdateDocument, {
		variables: { id, input },
		cache: "no-cache"
	});

	const errors = result.accountAddressUpdate?.errors ?? [];
	if (errors.length > 0) {
		return { success: false, error: errors[0]?.message ?? "Failed to update address" };
	}

	revalidatePath("/account/address");
	return { success: true };
}

export async function deleteAddress(id: string): Promise<{ success: boolean; error?: string }> {
	const result = await executeGraphQL(UserAddressDeleteDocument, {
		variables: { id },
		cache: "no-cache"
	});

	const errors = result.accountAddressDelete?.errors ?? [];
	if (errors.length > 0) {
		return { success: false, error: errors[0]?.message ?? "Failed to delete address" };
	}

	revalidatePath("/account/address");
	return { success: true };
}
