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
		<div className="bg-card rounded-lg p-6 shadow-sm">
			<div className="mb-6">
				<h2 className="text-foreground text-2xl font-bold">Contact information</h2>
				<p className="text-muted-foreground mt-1 text-sm">We&apos;ll use this to send order updates</p>
			</div>

			<div className="space-y-4">
				{/* Email Input */}
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
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setEmailError("");
							}}
							onKeyPress={handleKeyPress}
							className={`block w-full rounded-lg border ${
								emailError ? "border-destructive" : "border-input"
							} bg-card text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring py-3 pr-3 pl-10 focus:ring-1 focus:outline-none`}
							placeholder="you@example.com"
						/>
					</div>
					{emailError && <p className="text-destructive mt-2 text-sm">{emailError}</p>}
				</div>

				{/* Continue Button */}
				<Button
					onClick={handleContinue}
					disabled={!email || isChecking}
					className="group disabled:bg-muted w-full justify-between"
					size="lg"
				>
					<span>Continue as Guest</span>
					<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</Button>

				{/* Login Link */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="border-border w-full border-t"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-card text-muted-foreground px-4">or</span>
					</div>
				</div>

				<div className="text-center">
					<p className="text-muted-foreground text-sm">
						Already have an account?{" "}
						<Link
							href="/login?redirect=/checkout"
							className="text-foreground hover:text-foreground/80 font-semibold hover:underline"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>

			{/* Newsletter Checkbox (Optional) */}
			<div className="border-border mt-6 border-t pt-6">
				<label className="flex items-start gap-3">
					<input
						type="checkbox"
						className="border-input text-primary focus:ring-ring mt-0.5 h-4 w-4 rounded"
						defaultChecked
					/>
					<span className="text-muted-foreground text-sm">Email me with news and offers</span>
				</label>
			</div>
		</div>
	);
};

export { CheckoutContact };
