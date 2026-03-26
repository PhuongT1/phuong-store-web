"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@components/ui";
import { LinkWithChannel } from "@components/navigation";

const RegisterPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams?.get("redirect") ?? "/";

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Partial<typeof formData & { general?: string }>>({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: typeof errors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

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

	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData({ ...formData, [field]: value });
		setErrors({ ...errors, [field]: undefined });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			// TODO: Implement actual registration logic here
			// const response = await register(formData);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// On success, redirect to login or auto-login
			router.push(redirect);
		} catch (error) {
			setErrors({ general: "Registration failed. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#f8fafc] py-12">
			<div className="mx-auto max-w-md px-4 sm:px-6">
				{/* Header */}
				<div className="mb-8 text-center">
					<LinkWithChannel href="/" className="mb-6 inline-block">
						<div className="text-2xl font-bold text-gray-900">LOGO</div>
					</LinkWithChannel>
					<h1 className="text-3xl font-bold text-gray-900">Create account</h1>
					<p className="mt-2 text-sm text-gray-600">Join us and enjoy exclusive benefits</p>
				</div>

				{/* Register Form */}
				<div className="rounded-lg bg-white p-8 shadow-sm">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* General Error */}
						{errors.general && (
							<div className="rounded-lg bg-red-50 p-4">
								<p className="text-sm text-red-800">{errors.general}</p>
							</div>
						)}

						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-4">
							{/* First Name */}
							<div>
								<label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
									First name
								</label>
								<div className="relative mt-2">
									<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<User className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										id="firstName"
										value={formData.firstName}
										onChange={(e) => handleChange("firstName", e.target.value)}
										className={`block w-full rounded-lg border ${
											errors.firstName ? "border-red-300" : "border-gray-300"
										} bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none`}
										placeholder="John"
									/>
								</div>
								{errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
							</div>

							{/* Last Name */}
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
									Last name
								</label>
								<div className="mt-2">
									<input
										type="text"
										id="lastName"
										value={formData.lastName}
										onChange={(e) => handleChange("lastName", e.target.value)}
										className={`block w-full rounded-lg border ${
											errors.lastName ? "border-red-300" : "border-gray-300"
										} bg-white px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none`}
										placeholder="Doe"
									/>
								</div>
								{errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-900">
								Email address
							</label>
							<div className="relative mt-2">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="email"
									id="email"
									value={formData.email}
									onChange={(e) => handleChange("email", e.target.value)}
									className={`block w-full rounded-lg border ${
										errors.email ? "border-red-300" : "border-gray-300"
									} bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none`}
									placeholder="you@example.com"
								/>
							</div>
							{errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-900">
								Password
							</label>
							<div className="relative mt-2">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									value={formData.password}
									onChange={(e) => handleChange("password", e.target.value)}
									className={`block w-full rounded-lg border ${
										errors.password ? "border-red-300" : "border-gray-300"
									} bg-white py-3 pr-10 pl-10 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none`}
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 flex items-center pr-3"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
							{errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
							<p className="mt-2 text-xs text-gray-500">Must be at least 8 characters</p>
						</div>

						{/* Confirm Password Field */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
								Confirm password
							</label>
							<div className="relative mt-2">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									id="confirmPassword"
									value={formData.confirmPassword}
									onChange={(e) => handleChange("confirmPassword", e.target.value)}
									className={`block w-full rounded-lg border ${
										errors.confirmPassword ? "border-red-300" : "border-gray-300"
									} bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none`}
									placeholder="••••••••"
								/>
							</div>
							{errors.confirmPassword && (
								<p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
							)}
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isLoading}
							className="group w-full justify-between rounded-lg bg-gray-900 px-6 py-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
							size="lg"
						>
							<span>{isLoading ? "Creating account..." : "Create account"}</span>
							<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Button>
					</form>

					{/* Login Link */}
					<div className="mt-6 border-t border-gray-200 pt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
								className="font-semibold text-gray-900 hover:text-gray-700 hover:underline"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>

				{/* Back to Home */}
				<div className="mt-6 text-center">
					<LinkWithChannel href="/" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
						← Back to store
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
