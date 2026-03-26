/**
 * ==========================================================
 * Submit Form
 * Ensures form submission works as expected.
 * Covers API calls, success/error handling, and loading states.
 * ==========================================================
 */

// describe("Submit Form", () => {});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { LoginScreen } from "../../screens/SignIn.screen";
import { validUser } from "../../fixtures/user";
import { SignIn } from "../../../sign-in/SignIn";

const triggerMock = vi.fn();
const phuong = vi.fn();

vi.mock("@hooks/auth", () => ({
	useLogin: () => ({ trigger: triggerMock })
}));

vi.mock("next/navigation", () => require("next-router-mock/navigation"));

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
	vi.clearAllMocks();
	user = userEvent.setup();
	render(<SignIn />);
});

describe("Login component", () => {
	it("successful login => redirect to search page", async () => {
		const {
			fields: { email, password },
			buttons: { login }
		} = LoginScreen;

		await user.type(email(), validUser.email);
		await user.type(password(), validUser.password);
		await user.click(login());

		expect(triggerMock).toHaveBeenCalledWith(
			expect.objectContaining({
				email: validUser.email,
				password: expect.any(String)
			})
		);

		expect(mockRouter).toMatchObject({ pathname: "/dashboard" });
	});
});
