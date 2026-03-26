"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@components/ui";

type CheckoutContactProps = {
	onContinue: (email: string, asGuest: boolean) => void;
	initialEmail?: string;
};

const CheckoutContact = ({ onContinue, initialEmail = "" }: CheckoutContactProps) => {
	const [email, setEmail] = useState(initialEmail);
	const [emailError, setEmailError] = useState("");
	const [isChecking, setIsChecking] = useState(false);

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleContinue = async () => {
		if (!validateEmail(email)) {
			setEmailError("Please enter a valid email address");
			return;
		}

		setEmailError("");
		setIsChecking(true);

		// TODO: Check if email exists in system
		// For now, we'll just continue as guest
		setTimeout(() => {
			setIsChecking(false);
			onContinue(email, true); // true = guest checkout
		}, 500);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			void handleContinue();
		}
	};

	return (
		<div className="rounded-lg bg-white p-6 shadow-sm">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Contact information</h2>
				<p className="mt-1 text-sm text-gray-600">We&apos;ll use this to send order updates</p>
			</div>

			<div className="space-y-4">
				{/* Email Input */}
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
								setEmailError("");
							}}
							onKeyPress={handleKeyPress}
							className={`block w-full rounded-lg border ${
								emailError ? "border-red-300" : "border-gray-300"
							} bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none`}
							placeholder="you@example.com"
						/>
					</div>
					{emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
				</div>

				{/* Continue Button */}
				<Button
					onClick={handleContinue}
					disabled={!email || isChecking}
					className="group w-full justify-between rounded-lg bg-gray-900 px-6 py-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
					size="lg"
				>
					<span>Continue as Guest</span>
					<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</Button>

				{/* Login Link */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-white px-4 text-gray-500">or</span>
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="/login?redirect=/checkout"
							className="font-semibold text-gray-900 hover:text-gray-700 hover:underline"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>

			{/* Newsletter Checkbox (Optional) */}
			<div className="mt-6 border-t border-gray-200 pt-6">
				<label className="flex items-start gap-3">
					<input
						type="checkbox"
						className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
						defaultChecked
					/>
					<span className="text-sm text-gray-600">Email me with news and offers</span>
				</label>
			</div>
		</div>
	);
};

export { CheckoutContact };
