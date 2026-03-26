import { vi } from "vitest";

vi.mock("@saleor/auth-sdk/next/server", () => ({
	createClient: vi.fn(() => ({
		signIn: vi.fn(),
		signOut: vi.fn(),
		verifyToken: vi.fn()
	}))
}));
