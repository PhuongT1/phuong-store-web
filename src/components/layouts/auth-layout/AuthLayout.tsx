import { type ReactNode } from "react";
import { LinkWithChannel } from "@components/navigation";
import { ImageItem } from "@components/ui";
import { LanguageSwitcher } from "@components/language/LanguageSwitcher";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<div className="min-h-screen bg-[#f8fafc]">
			{/* Simple Logo Header */}
			<div className="border-b border-gray-200 bg-white">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<LinkWithChannel href="/" className="inline-block">
							<ImageItem priority width={60} alt="Logo" src="/images/logo.png" />
						</LinkWithChannel>
						<LanguageSwitcher />
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main>{children}</main>
		</div>
	);
};

export { AuthLayout };
