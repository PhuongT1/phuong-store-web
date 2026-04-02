/**
 * ==========================================================
 * Render UI
 * Ensures all required elements are visible on initial load.
 * No interactions or state updates are tested in this section.
 * ==========================================================
 */

// describe("Render UI", () => {});

/**
 * ==========================================================
 * Input Behavior
 * Verifies how the component handles user interactions.
 * Includes typing, clicking, focusing, and other input events.
 * ==========================================================
 */

// describe("Input Behavior", () => {});

/**
 * ==========================================================
 * Validation
 * Confirms that validation rules and error messages work correctly.
 * Tests both empty fields and invalid input formats.
 * ==========================================================
 */

// describe("Validation", () => {});

import { render , screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, it, expect, beforeEach , vi } from "vitest";
import { SignIn } from "../../../sign-in/SignIn";
import { LoginScreen } from "../../screens/SignIn.screen";

let user: UserEvent;

beforeEach(() => {
	vi.clearAllMocks();
	render(<SignIn />);
	user = userEvent.setup();
});

describe("Render UI", () => {
	it("Render UI Email", () => expect(LoginScreen.fields.email()).toBeInTheDocument());
	it("Render UI Password", () => expect(LoginScreen.fields.password()).toBeInTheDocument());
	it("Render UI Login Button", () => expect(LoginScreen.buttons.login()).toBeInTheDocument());
	it("Render UI Register Button", () => expect(LoginScreen.buttons.register()).toBeInTheDocument());
});

describe("Input Behavior", () => {
	it("Allows typing in the email field", async () => {
		const email = LoginScreen.fields.email();
		await user.type(email, "hello@gmail.com");
		expect(email).toHaveValue("hello@gmail.com");
	});

	it("Allows typing in the password field", async () => {
		const password = LoginScreen.fields.password();
		await user.type(password, "hello@gmail.com");
		expect(password).toHaveValue("hello@gmail.com");
	});

	it("Aoggles password visibility when clicking the eye icon", async () => {
		const passwordInput = LoginScreen.fields.password();
		const toggleBtn = LoginScreen.buttons.togglePassword();

		// Initial state
		expect(passwordInput).toHaveAttribute("type", "password");

		// Show password
		await user.click(toggleBtn);
		expect(passwordInput).toHaveAttribute("type", "text");

		// Hide password
		await user.click(toggleBtn);
		expect(passwordInput).toHaveAttribute("type", "password");
	});
});

describe("Validation", () => {
	const blurSpy = vi.fn();
	it("shows required error when email is empty and blurred", async () => {
		const email = LoginScreen.fields.email();
		email.addEventListener("blur", blurSpy);

		await user.click(email);
		await user.tab();

		expect(blurSpy).toHaveBeenCalled();
		expect(screen.getByText(/form-validation.required/i)).toBeInTheDocument();
		screen.debug();
	});
});
