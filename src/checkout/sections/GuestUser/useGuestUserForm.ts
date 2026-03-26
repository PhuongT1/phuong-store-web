import { useEffect, useState, useMemo } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCheckout } from "@hooks/checkout";
import { useUserRegisterMutation } from "@/checkout/graphql";
import {
	useCheckoutUpdateStateActions,
	useCheckoutUpdateStateChange,
	useUserRegisterState
} from "@/checkout/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { getCurrentHref } from "@/checkout/lib/utils/locale";
import { useCheckoutEmailUpdate } from "@/checkout/sections/GuestUser/useCheckoutEmailUpdate";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useUser } from "@/checkout/hooks/useUser";

export interface GuestUserFormData {
	email: string;
	password: string;
	createAccount: boolean;
}

interface GuestUserFormProps {
	// shared between sign in form and guest user form
	initialEmail: string;
}

export const useGuestUserForm = ({ initialEmail }: GuestUserFormProps) => {
	const { checkout } = useCheckout();
	const { user } = useUser();
	const shouldUserRegister = useUserRegisterState();
	const { setShouldRegisterUser, setSubmitInProgress } = useCheckoutUpdateStateActions();
	const { errorMessages } = useErrorMessages();
	const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
	const [, userRegister] = useUserRegisterMutation();
	const [userRegisterDisabled, setUserRegistrationDisabled] = useState(false);
	const { setCheckoutUpdateState } = useCheckoutUpdateStateChange("checkoutEmailUpdate");

	const validationSchema = yup.object({
		createAccount: yup.bool().default(false),
		email: yup.string().email(errorMessages.invalid).required(errorMessages.required),
		password: yup
			.string()
			.default("")
			.when(["createAccount"], ([createAccount], field) =>
				createAccount ? field.min(8, errorMessages.passwordAtLeastCharacters).required() : field
			)
	});

	const defaultFormData: GuestUserFormData = {
		email: initialEmail || checkout?.email || "",
		password: "",
		createAccount: false
	};

	const onSubmit = useFormSubmit<GuestUserFormData, typeof userRegister>(
		useMemo(
			() => ({
				scope: "userRegister",
				onSubmit: userRegister,
				onStart: () => setShouldRegisterUser(false),
				shouldAbort: async ({ formData, formHelpers: { validateForm } }) => {
					const errors = await validateForm(formData);
					// return hasErrors(errors);
					return false;
				},
				parse: ({ email, password, channel }) => ({
					input: {
						email,
						password,
						channel,
						redirectUrl: getCurrentHref()
					}
				}),
				onError: ({ errors }) => {
					setSubmitInProgress(false);
					const hasAccountForCurrentEmail = errors.some(({ code }) => code === "UNIQUE");

					if (hasAccountForCurrentEmail) {
						setUserRegistrationDisabled(true);
						// @todo this logic will be removed once new register flow is implemented
						setTimeout(() => setRegisterState("success"), 100);
					}
				},
				onSuccess: () => setUserRegistrationDisabled(true)
			}),
			[setRegisterState, setShouldRegisterUser, setSubmitInProgress, userRegister]
		)
	);

	const form = useForm<GuestUserFormData>({
		defaultValues: defaultFormData,
		mode: "onBlur",
		resolver: yupResolver(validationSchema)
	});

	const { watch } = form;
	const email = watch("email");

	useCheckoutFormValidationTrigger({
		scope: "guestUser",
		form
	});

	useCheckoutEmailUpdate({ email });

	return { form };
};
