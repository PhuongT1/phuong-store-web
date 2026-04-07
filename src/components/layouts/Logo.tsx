"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../navigation/LinkWithChannel";

// Same file as favicon (src/lib/metadata.ts icons.icon)
const LOGO_ICON = "/images/logo-icon.svg";

const Logo = () => {
	const pathname = usePathname();

	const LogoContent = () => (
		<div className="group flex cursor-pointer items-center gap-2 transition-transform duration-200 active:scale-95">
			<Image src={LOGO_ICON} alt="" width={28} height={28} className="shrink-0" aria-hidden="true" />
			<span
				className="text-[1.1rem] font-black tracking-[-0.04em] uppercase"
				style={{ color: "var(--brand-logo)" }}
			>
				Deal24
			</span>
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
