"use client";

import useSWRMutation from "swr/mutation";
import { signIn } from "next-auth/react";
import { CONFIG } from "@/constants";
import { type ErrorForm, type LoginForm } from "@/types";

type LoginProps = {
	onSuccess?: () => void;
	onError?: <T extends ErrorForm = ErrorForm>(errors: T) => void;
};

const useLogin = ({ onSuccess, onError }: LoginProps) => {
	const fetchData = async (_key: string, { arg }: { arg: LoginForm }) => {
		const res = await signIn("credentials", {
			redirect: false,
			...arg
		});

		if (res?.error) {
			throw JSON.parse(res?.error);
		}
		return res;
	};

	return useSWRMutation(CONFIG.CHECKOUT_KEY.transactionProcessKey, fetchData, {
		onSuccess: () => onSuccess?.(),
		onError: (errors: any) => onError?.(errors),
		showLoading: true
		// showLoadingAfterFetch: true
	} as any);
};

export { useLogin };
