import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authConfig } from "@/auth/authConfig";
import { isServer } from "@/lib/utils";

const getUserSession = async () => {
	if (isServer()) {
		return getServerSession(authConfig);
	} else {
		// Client side
		return getSession();
	}
};

export { getUserSession };
