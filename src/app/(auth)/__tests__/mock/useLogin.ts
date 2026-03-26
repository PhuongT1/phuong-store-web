import { vi } from "vitest";

vi.mock("@hooks/auth", () => ({
	useLogin: () => ({ trigger: vi.fn() })
}));
