import { useEffect, useState } from "react";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";
import { useMutation } from "@/checkout/lib/useMutation";
import { getCurrentHref } from "@/checkout/lib/utils/locale";
import { type RequestPasswordResetMutation, type RequestPasswordResetMutationVariables, RequestPasswordResetDocument } from "@/gql/graphql";

interface PasswordResetFormData {
	email: string;
	shouldAbort: () => Promise<boolean>;
}

export const usePasswordResetRequest = ({ email, shouldAbort }: PasswordResetFormData) => {
	const { showSuccess } = useAlerts();

	const [, requestPasswordReset] = useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(RequestPasswordResetDocument);

	const [passwordResetSent, setPasswordResetSent] = useState(false);

	const onSubmit = useSubmit<{}, typeof requestPasswordReset>({
		scope: "requestPasswordReset",
		onSubmit: requestPasswordReset,
		shouldAbort,
		onSuccess: () => {
			setPasswordResetSent(true);
			showSuccess(`A magic link has been sent to ${email}`);
		},
		parse: ({ channel }) => ({ email, redirectUrl: getCurrentHref(), channel }),
	});

	useEffect(() => {
		setPasswordResetSent(false);
	}, [email]);

	return {
		onPasswordResetRequest: () => {
			void onSubmit();
		},
		passwordResetSent,
	};
};
