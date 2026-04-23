const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const parseApiResponse = async <T>(response: Response): Promise<T> => {
	const contentType = response.headers.get("content-type") ?? "";
	const raw = await response.text();

	if (!raw.trim()) {
		return undefined as T;
	}

	if (contentType.includes("application/json")) {
		return JSON.parse(raw) as T;
	}

	return raw as T;
};

export async function getAPI<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...headers
			}
		});

		if (!response.ok) {
			let errorDetails;
			try {
				errorDetails = await parseApiResponse(response);
			} catch {
				errorDetails = await response.text();
			}
			throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(errorDetails)}`);
		}

		return await parseApiResponse<T>(response);
	} catch (error) {
		console.error("GET API Error:", (error as Error).message);
		throw error;
	}
}

export async function postAPI<T, U>(
	endpoint: string,
	body: T,
	headers: HeadersInit = {},
	isBaseUrl = true
): Promise<U> {
	try {
		const url = isBaseUrl ? `${BASE_URL}${endpoint}` : endpoint;
		console.log({ url });

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...headers
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			let errorDetails;
			try {
				errorDetails = await parseApiResponse(response);
			} catch {
				errorDetails = response;
			}
			throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(errorDetails)}`);
		}
		return await parseApiResponse<U>(response);
	} catch (error) {
		console.error("POST API Error:", (error as Error).message);
		throw error;
	}
}
