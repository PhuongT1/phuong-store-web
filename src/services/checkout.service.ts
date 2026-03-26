import {
	type CheckoutCompleteMutationVariables,
	CheckoutLinesUpdateDocument,
	type CheckoutLinesUpdateMutationVariables,
	CheckoutDeleteLinesDocument,
	type CheckoutDeleteLinesMutationVariables,
	CheckoutCompleteDocument,
	CheckoutLinesAddDocument,
	type CheckoutLinesAddMutationVariables
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

const CheckoutCompleteForm = async (_key: string, { arg }: { arg: CheckoutCompleteMutationVariables }) => {
	if (!arg?.checkoutId) return;
	try {
		return await executeGraphQL(CheckoutCompleteDocument, { variables: arg });
	} catch (error) {
		throw error;
	}
};

const CheckoutLinesUpdateForm = async (
	_key: string,
	{ arg }: { arg: CheckoutLinesUpdateMutationVariables }
) => {
	if (!arg?.checkoutId) return;
	try {
		return await executeGraphQL(CheckoutLinesUpdateDocument, { variables: arg, withAuth: false });
	} catch (error) {
		throw error;
	}
};

const CheckoutLinesDeleteForm = async (
	_key: string,
	{ arg }: { arg: CheckoutDeleteLinesMutationVariables }
) => {
	if (!arg?.checkoutId) return;
	try {
		return await executeGraphQL(CheckoutDeleteLinesDocument, { variables: arg, withAuth: false });
	} catch (error) {
		throw error;
	}
};

const CheckoutLinesAddForm = async (_key: string, { arg }: { arg: CheckoutLinesAddMutationVariables }) => {
	if (!arg?.id) return;
	try {
		return await executeGraphQL(CheckoutLinesAddDocument, { variables: arg, withAuth: false });
	} catch (error) {
		throw error;
	}
};

export { CheckoutCompleteForm, CheckoutLinesUpdateForm, CheckoutLinesDeleteForm, CheckoutLinesAddForm };
