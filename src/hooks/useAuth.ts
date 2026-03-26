"use client";

import useSWRMutation from "swr/mutation";
import { useRatingInfinite } from "./useRatingProduct";
// import { signInForm } from "@/action/auth/auth";

const useLogin = () => {
	// return useSWRMutation("auth-login", signInForm);
};

export { useRatingInfinite, useLogin };
