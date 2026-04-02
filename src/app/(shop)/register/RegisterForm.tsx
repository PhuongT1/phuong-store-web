"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@components/ui";

interface RegisterFormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface RegisterFormProps {
	onSubmit: (data: RegisterFormData) => Promise<void>;
	isLoading: boolean;
	generalError?: string;
}

export const RegisterForm = ({ onSubmit, isLoading, generalError }: RegisterFormProps) => {
	const [formData, setFormData] = useState<RegisterFormData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

	const validateForm = () => {
		const newErrors: Partial<RegisterFormData> = {};
		if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
		if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (field: keyof RegisterFormData, value: string) => {
		setFormData({ ...formData, [field]: value });
		setErrors({ ...errors, [field]: undefined });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		await onSubmit(formData);
	};

	const inputClass = (hasError: boolean) =>
		`block w-full rounded-lg border ${hasError ? "border-destructive" : "border-input"} bg-card py-3 pr-3 pl-10 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none`;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{generalError && (
				<div className="bg-destructive/10 rounded-lg p-4">
					<p className="text-destructive text-sm">{generalError}</p>
				</div>
			)}

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="firstName" className="text-foreground block text-sm font-medium">
						First name
					</label>
					<div className="relative mt-2">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<User className="text-muted-foreground h-5 w-5" />
						</div>
						<input
							type="text"
							id="firstName"
							value={formData.firstName}
							onChange={(e) => handleChange("firstName", e.target.value)}
							className={inputClass(!!errors.firstName)}
							placeholder="John"
						/>
					</div>
					{errors.firstName && <p className="text-destructive mt-2 text-sm">{errors.firstName}</p>}
				</div>

				<div>
					<label htmlFor="lastName" className="text-foreground block text-sm font-medium">
						Last name
					</label>
					<div className="mt-2">
						<input
							type="text"
							id="lastName"
							value={formData.lastName}
							onChange={(e) => handleChange("lastName", e.target.value)}
							className={inputClass(!!errors.lastName).replace("pl-10", "px-3")}
							placeholder="Doe"
						/>
					</div>
					{errors.lastName && <p className="text-destructive mt-2 text-sm">{errors.lastName}</p>}
				</div>
			</div>

			<div>
				<label htmlFor="email" className="text-foreground block text-sm font-medium">
					Email address
				</label>
				<div className="relative mt-2">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Mail className="text-muted-foreground h-5 w-5" />
					</div>
					<input
						type="email"
						id="email"
						value={formData.email}
						onChange={(e) => handleChange("email", e.target.value)}
						className={inputClass(!!errors.email)}
						placeholder="you@example.com"
					/>
				</div>
				{errors.email && <p className="text-destructive mt-2 text-sm">{errors.email}</p>}
			</div>

			<div>
				<label htmlFor="password" className="text-foreground block text-sm font-medium">
					Password
				</label>
				<div className="relative mt-2">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock className="text-muted-foreground h-5 w-5" />
					</div>
					<input
						type={showPassword ? "text" : "password"}
						id="password"
						value={formData.password}
						onChange={(e) => handleChange("password", e.target.value)}
						className={inputClass(!!errors.password).replace("pr-3", "pr-10")}
						placeholder="••••••••"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute inset-y-0 right-0 flex items-center pr-3"
					>
						{showPassword ? (
							<EyeOff className="text-muted-foreground hover:text-foreground h-5 w-5" />
						) : (
							<Eye className="text-muted-foreground hover:text-foreground h-5 w-5" />
						)}
					</button>
				</div>
				{errors.password && <p className="text-destructive mt-2 text-sm">{errors.password}</p>}
				<p className="text-muted-foreground mt-2 text-xs">Must be at least 8 characters</p>
			</div>

			<div>
				<label htmlFor="confirmPassword" className="text-foreground block text-sm font-medium">
					Confirm password
				</label>
				<div className="relative mt-2">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock className="text-muted-foreground h-5 w-5" />
					</div>
					<input
						type={showPassword ? "text" : "password"}
						id="confirmPassword"
						value={formData.confirmPassword}
						onChange={(e) => handleChange("confirmPassword", e.target.value)}
						className={inputClass(!!errors.confirmPassword)}
						placeholder="••••••••"
					/>
				</div>
				{errors.confirmPassword && <p className="text-destructive mt-2 text-sm">{errors.confirmPassword}</p>}
			</div>

			<Button
				type="submit"
				disabled={isLoading}
				className="group disabled:bg-muted w-full justify-between"
				size="lg"
			>
				<span>{isLoading ? "Creating account..." : "Create account"}</span>
				<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</Button>
		</form>
	);
};
