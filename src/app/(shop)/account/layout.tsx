"use client";

import { usePathname } from "next/navigation";
import { User, Package, MapPin, Settings, LogOut } from "lucide-react";

import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { signOutUser } from "@/auth/authActions";

const sidebarLinks = [
	{
		title: "Hồ sơ của tôi",
		href: "/account/profile",
		icon: User
	},
	{
		title: "Đơn hàng của tôi",
		href: "/account/orders",
		icon: Package
	},
	{
		title: "Sổ địa chỉ",
		href: "/account/address",
		icon: MapPin
	},
	{
		title: "Cài đặt",
		href: "/account/settings",
		icon: Settings
	}
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-8 lg:flex-row">
				{/* Sidebar */}
				<aside className="w-full shrink-0 lg:w-64">
					<div className="rounded-2xl border border-gray-200 bg-white p-4">
						<div className="mb-6 hidden px-4 py-2 lg:block">
							<h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
								Quản lý tài khoản
							</h3>
						</div>

						{/* Scrollable on Mobile, Stacked on Desktop */}
						<nav className="scrollbar-hide flex space-x-2 overflow-x-auto pb-2 lg:flex-col lg:space-y-1 lg:space-x-0 lg:overflow-visible lg:pb-0">
							{sidebarLinks.map((link) => {
								const isActive = pathname?.includes(link.href) ?? false;
								const Icon = link.icon;

								return (
									<LinkWithChannel
										key={link.title}
										href={link.href}
										className={`flex shrink-0 items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors lg:justify-start ${
											isActive
												? "bg-primary/10 text-primary"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
									>
										<Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
										<span>{link.title}</span>
									</LinkWithChannel>
								);
							})}

							<div className="hidden pt-4 lg:block">
								<hr className="mb-4 border-gray-100" />
								<button
									type="button"
									onClick={() => signOutUser()}
									className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
								>
									<LogOut className="h-5 w-5" />
									<span>Đăng xuất</span>
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
