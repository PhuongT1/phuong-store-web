"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@components/ui";
import { LinkWithChannel } from "@components/navigation";

const LoginPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams?.get("redirect") ?? "/";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: typeof errors = {};

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			// TODO: Implement actual login logic here
			// const response = await login(email, password);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// On success, redirect
			router.push(redirect);
		} catch (error) {
			setErrors({ general: "Invalid email or password" });
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
					<h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
					<p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
				</div>

				{/* Login Form */}
				<div className="rounded-lg bg-white p-8 shadow-sm">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* General Error */}
						{errors.general && (
							<div className="rounded-lg bg-red-50 p-4">
								<p className="text-sm text-red-800">{errors.general}</p>
							</div>
						)}

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
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										setErrors({ ...errors, email: undefined });
									}}
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
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										setErrors({ ...errors, password: undefined });
									}}
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
						</div>

						{/* Forgot Password Link */}
						<div className="flex items-center justify-end">
							<Link
								href="/forgot-password"
								className="text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isLoading}
							className="group w-full justify-between rounded-lg bg-gray-900 px-6 py-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
							size="lg"
						>
							<span>{isLoading ? "Signing in..." : "Sign in"}</span>
							<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Button>
					</form>

					{/* Register Link */}
					<div className="mt-6 border-t border-gray-200 pt-6 text-center">
						<p className="text-sm text-gray-600">
							Don&apos;t have an account?{" "}
							<Link
								href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
								className="font-semibold text-gray-900 hover:text-gray-700 hover:underline"
							>
								Create account
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

export default LoginPage;
