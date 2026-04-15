import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: unknown): boolean => {
	if (typeof token !== "string" || !token) {
		return true;
	}
	try {
		const decoded = jwtDecode(token);
		if (!decoded?.exp) {
			return true;
		}

		const currentTime = Math.floor(Date.now() / 1000);
		const expirationTime = Number(decoded?.exp);
		// Add 60 seconds buffer to refresh before actual expiration
		return expirationTime < currentTime + 60;
	} catch {
		return true;
	}
};

export { isTokenExpired };
