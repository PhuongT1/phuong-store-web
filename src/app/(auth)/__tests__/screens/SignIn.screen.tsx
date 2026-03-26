/**
 * LoginScreen
 * Encapsulates all UI selectors for the Login page.
 * Helps tests stay readable and maintainable.
 */
import { screen } from "@testing-library/react";

const LoginScreen = {
	fields: {
		email: () => screen.getByPlaceholderText(/Email/i),
		password: () => screen.getByPlaceholderText(/Mật khẩu/i)
	},
	buttons: {
		togglePassword: () => screen.getByLabelText("toggle-password-visibility"),
		login: () => screen.getByRole("button", { name: /đăng nhập/i }),
		register: () => screen.getByRole("button", { name: /Đăng ký/i })
	},
	messages: {
		emailRequired: () => screen.getByText(/Email không được để trống/i)
	}
};

export { LoginScreen };
