"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Settings, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { signOutUser } from "@/auth/authActions";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const t = useTranslations("account");

	const sidebarLinks = [
		{ title: t("profile"), href: "/account/profile", icon: User },
		{ title: t("myOrders"), href: "/account/orders", icon: Package },
		{ title: t("addresses"), href: "/account/address", icon: MapPin },
		{ title: t("settings"), href: "/account/settings", icon: Settings }
	];

	return (
		<div className="mx-auto w-full max-w-(--container-max-w) px-3 py-8 md:px-6 lg:px-8">
			<div className="flex flex-col gap-8 lg:flex-row">
				{/* Sidebar */}
				<aside className="w-full shrink-0 lg:w-64">
					<div className="border-border bg-card rounded-2xl border p-4">
						<div className="mb-6 hidden px-4 py-2 lg:block">
							<h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
								{t("manage")}
							</h3>
						</div>

						{/* Scrollable on Mobile, Stacked on Desktop */}
						<nav className="scrollbar-hide flex space-x-2 overflow-x-auto pb-2 lg:flex-col lg:space-y-1 lg:space-x-0 lg:overflow-visible lg:pb-0">
							{sidebarLinks.map((link) => {
								const isActive = pathname?.includes(link.href) ?? false;
								const Icon = link.icon;

								return (
									<Link
										key={link.title}
										href={link.href}
										className={`flex shrink-0 items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors lg:justify-start ${
											isActive
												? "bg-info/10 text-info"
												: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
										}`}
									>
										<Icon className={`h-5 w-5 ${isActive ? "text-info" : "text-muted-foreground"}`} />
										<span>{link.title}</span>
									</Link>
								);
							})}

							<div className="hidden pt-4 lg:block">
								<hr className="border-border mb-4" />
								<button
									type="button"
									onClick={() => signOutUser()}
									className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
								>
									<LogOut className="h-5 w-5" />
									<span>{t("logout")}</span>
								</button>
							</div>
						</nav>
					</div>
				</aside>

				{/* Main Content */}
				<main className="w-full min-w-0 flex-1">{children}</main>
			</div>
		</div>
	);
}
