"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LinkWithChannel } from "@components/navigation";
import { RegisterForm } from "./RegisterForm";

const RegisterPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams?.get("redirect") ?? "/";
	const [isLoading, setIsLoading] = useState(false);
	const [generalError, setGeneralError] = useState<string>();

	const handleSubmit = async () => {
		setIsLoading(true);
		setGeneralError(undefined);
		try {
			// TODO: Implement actual registration logic
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push(redirect);
		} catch {
			setGeneralError("Registration failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen py-12">
			<div className="mx-auto max-w-md px-4 sm:px-6">
				<div className="mb-8 text-center">
					<LinkWithChannel href="/" className="mb-6 inline-block">
						<div className="text-2xl font-bold text-foreground">LOGO</div>
					</LinkWithChannel>
					<h1 className="text-3xl font-bold text-foreground">Create account</h1>
					<p className="mt-2 text-sm text-muted-foreground">Join us and enjoy exclusive benefits</p>
				</div>

				<div className="rounded-lg bg-card p-8 shadow-sm">
					<RegisterForm onSubmit={handleSubmit} isLoading={isLoading} generalError={generalError} />

					<div className="mt-6 border-t border-border pt-6 text-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
								className="font-semibold text-foreground hover:text-foreground/80 hover:underline"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>

				<div className="mt-6 text-center">
					<LinkWithChannel href="/" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
						← Back to store
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
