"use client";

import { signIn } from "next-auth/react";
import useSWRMutation from "swr/mutation";
import { CONFIG } from "@/constants";
import { type ErrorForm, type LoginForm } from "@/types";

type LoginProps = {
	onSuccess?: () => void;
	onError?: <T extends ErrorForm = ErrorForm>(errors: T) => void;
};

const parseSignInError = (error: string): ErrorForm => {
	try {
		const parsed: unknown = JSON.parse(error);
		if (Array.isArray(parsed)) return parsed as ErrorForm;
		if (parsed && typeof parsed === "object" && "message" in parsed) {
			return [{ field: "email", message: (parsed as { message: string }).message }];
		}
		return [{ field: "email", message: error }];
	} catch {
		// NextAuth returns generic error codes like "CredentialsSignin"
		return [{ field: "email", message: "Email không tồn tại hoặc chưa được đăng ký." }];
	}
};

const useLogin = ({ onSuccess, onError }: LoginProps) => {
	const fetchData = async (_key: string, { arg }: { arg: LoginForm }) => {
		// Only send email — server derives password automatically (passwordless login)
		const res = await signIn("credentials", {
			redirect: false,
			email: arg.email
		});

		if (res?.error) {
			const errors = parseSignInError(res.error);
			throw new Error(JSON.stringify(errors));
		}

		if (!res?.ok) {
			throw new Error(
				JSON.stringify([{ field: "email", message: "Đăng nhập thất bại" }] satisfies ErrorForm)
			);
		}

		return res;
	};

	return useSWRMutation(CONFIG.CHECKOUT_KEY.transactionProcessKey, fetchData, {
		onSuccess: () => onSuccess?.(),
		onError: (error: Error) => {
			try {
				const errors = JSON.parse(error.message) as ErrorForm;
				onError?.(errors);
			} catch {
				onError?.([{ field: "email", message: error.message }]);
			}
		}
	} as any);
};

export { useLogin };
