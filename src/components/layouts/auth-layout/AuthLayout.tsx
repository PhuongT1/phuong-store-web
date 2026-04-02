import { type ReactNode } from "react";
import { LanguageSwitcher } from "@components/language/LanguageSwitcher";
import { Logo } from "@components/layouts/Logo";
import { ThemeMode } from "@components/nav/components/ThemeMode";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Minimal header: logo + language switcher only */}
			<header className="border-border/50 border-b bg-card/80 backdrop-blur-sm">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
					<Logo />
					<div className="flex items-center gap-2">
						<ThemeMode />
						<LanguageSwitcher />
					</div>
				</div>
			</header>

			{/* Centered content — takes remaining height */}
			<main className="flex flex-1 items-center justify-center px-4 py-12">
				{children}
			</main>
		</div>
	);
};

export { AuthLayout };
