import { useCallback, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useCheckoutEmailUpdate } from "@/checkout/sections/auth/GuestUser/useCheckoutEmailUpdate";
import {
	useCheckoutUpdateStateChange,
	useUserRegisterState
} from "@/checkout/state/updateStateStore";
import { useCheckout } from "@hooks/checkout";

export interface GuestUserFormData {
	email: string;
	createAccount: boolean;
}

interface GuestUserFormProps {
	initialEmail: string;
}

export const useGuestUserForm = ({ initialEmail }: GuestUserFormProps) => {
	const { checkout } = useCheckout();
	const shouldUserRegister = useUserRegisterState();
	const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
	const { errorMessages } = useErrorMessages();

	const validationSchema = yup.object({
		createAccount: yup.bool().default(true),
		email: yup.string().email(errorMessages.invalid).required(errorMessages.required)
	});

	const defaultFormData: GuestUserFormData = {
		email: initialEmail || checkout?.email || "",
		createAccount: true
	};

	const form = useForm<GuestUserFormData>({
		defaultValues: defaultFormData,
		mode: "onBlur",
		resolver: yupResolver(validationSchema)
	});

	const { watch } = form;
	const email = watch("email");
	const createAccount = watch("createAccount");

	useCheckoutFormValidationTrigger({ scope: "guestUser", form });
	useCheckoutEmailUpdate({ email });

	/**
	 * Calls Saleor accountRegister directly from browser (client-side fetch).
	 * Visible in Network tab for debugging.
	 */
	const handleAutoRegister = useCallback(async () => {
		const currentEmail = form.getValues("email");
		if (!currentEmail || !createAccount) {
			setRegisterState("success");
			return;
		}

		setRegisterState("loading");
		try {
			const saleorUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
			const channel = checkout?.channel.slug ?? "default-channel";
			const res = await fetch(saleorUrl!, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: `mutation GuestRegister($email: String!, $password: String!, $channel: String!, $redirectUrl: String!) {
						accountRegister(input: { email: $email, password: $password, channel: $channel, redirectUrl: $redirectUrl }) {
							requiresConfirmation
							errors { field message code }
						}
					}`,
					variables: {
						email: currentEmail,
						password: "12345678",
						channel,
						redirectUrl: window.location.origin
					}
				})
			});
			const json = await res.json() as { data?: { accountRegister?: { errors?: { field: string; message: string; code: string }[] } } };
			const errors = json.data?.accountRegister?.errors ?? [];
			console.log("[GuestRegister] full response:", JSON.stringify(json, null, 2));
			// eslint-disable-next-line no-debugger
			debugger;
			const isAlreadyExists = errors.some((e) => e.code === "UNIQUE");
			if (errors.length && !isAlreadyExists) {
				console.warn("[GuestRegister] errors:", errors);
			}
		} catch (err) {
			console.error("Auto-register failed:", err);
		}

		setRegisterState("success");
	}, [checkout?.channel.slug, createAccount, form, setRegisterState]);

	useEffect(() => {
		if (!shouldUserRegister) return;
		void handleAutoRegister();
	}, [shouldUserRegister, handleAutoRegister]);

	return { form };
};
