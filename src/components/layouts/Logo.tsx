"use client";

import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../navigation/LinkWithChannel";

const Logo = () => {
	const pathname = usePathname();

	const LogoContent = () => (
		<div className="group flex cursor-pointer items-center gap-2 transition-transform duration-300 active:scale-95">
			<div className="border-border group-hover:bg-accent flex h-10 w-10 items-center justify-center rounded-none border bg-transparent transition-colors duration-200">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-foreground h-6 w-6"
				>
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
					<path d="M3 6h18" />
					<path d="M16 10a4 4 0 0 1-8 0" />
				</svg>
			</div>
			<div className="flex flex-col">
				<span className="text-foreground text-xl leading-none font-black tracking-tighter md:text-2xl">
					SALEOR<span className="text-foreground">.</span>
				</span>
				<span className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
					Storefront
				</span>
			</div>
		</div>
	);

	if (pathname === "/") {
		return (
			<h1 className="flex items-center" aria-label="homepage">
				<LogoContent />
			</h1>
		);
	}
	return (
		<LinkWithChannel aria-label="homepage" href="/">
			<LogoContent />
		</LinkWithChannel>
	);
};

export { Logo };
