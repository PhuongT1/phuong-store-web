import React from "react";
import { getTranslations } from "next-intl/server";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { LinkWithChannel } from "@components/navigation";
import { ContainerLayout } from "../ContainerLayout";
import { Logo } from "../Logo";

export async function Footer({ channel }: { channel: string }) {
	const t = await getTranslations("footer");
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel }
	});

	const linkClass =
		"text-[13px] sm:text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary";
	const headClass =
		"text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-foreground mb-4 sm:mb-8 block";

	return (
		<footer className="border-border/40 bg-card mt-0 border-t py-8 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 sm:py-10">
			<ContainerLayout>
				{/* 4-Column Grid distribution */}
				<div className="grid w-full grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4">
					{/* Column 1: Brand */}
					<div className="flex flex-col">
						<div className="mb-4 sm:mb-6">
							<Logo />
						</div>
						<p className="text-muted-foreground mb-6 pr-4 text-[13px] leading-relaxed sm:mb-8 sm:text-sm">
							{t("description")}
						</p>
						<div className="flex gap-4">
							<SocialIcon
								color="#1877F2"
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
							<SocialIcon
								color="#1DA1F2"
								d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
							/>
						</div>
					</div>

					{/* Column 2: About */}
					<div>
						<span className={headClass}>Về công ty</span>
						<ul className="flex flex-col gap-4">
							<li>
								<LinkWithChannel href="#" className={linkClass}>
									Giới thiệu
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="#" className={linkClass}>
									Tuyển dụng
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="#" className={linkClass}>
									Blog
								</LinkWithChannel>
							</li>
						</ul>
					</div>

					{/* Column 3: Support */}
					<div>
						<span className={headClass}>{t("support")}</span>
						<ul className="flex flex-col gap-4">
							<li>
								<LinkWithChannel href="#" className={linkClass}>
									{t("helpCenter")}
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="#" className={linkClass}>
									{t("privacy")}
								</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="#" className={linkClass}>
									{t("terms")}
								</LinkWithChannel>
							</li>
						</ul>
					</div>

					{/* Column 4: Links */}
					<div>
						<span className={headClass}>{t("quickLinks")}</span>
						<ul className="flex flex-col gap-4">
							{footerLinks.menu?.items?.slice(0, 3).map((item: { id: string; name: string }) => (
								<li key={item.id}>
									<LinkWithChannel href="#" className={linkClass}>
										{item.name}
									</LinkWithChannel>
								</li>
							))}
							{!footerLinks.menu?.items?.length && (
								<>
									<li>
										<LinkWithChannel href="#" className={linkClass}>
											{t("newProducts")}
										</LinkWithChannel>
									</li>
									<li>
										<LinkWithChannel href="#" className={linkClass}>
											{t("promotions")}
										</LinkWithChannel>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-border mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:mt-20 sm:gap-6 sm:pt-10 sm:flex-row">
					<p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
						© {new Date().getFullYear()} Deal 24.
					</p>
					<div className="flex items-center gap-10">
						<span className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-bold tracking-tight uppercase transition-colors">
							Privacy
						</span>
						<span className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-bold tracking-tight uppercase transition-colors">
							Terms
						</span>
						<div className="bg-border/60 h-4 w-px" />
						<span className="text-primary text-xs font-black tracking-widest uppercase">USD</span>
					</div>
				</div>
			</ContainerLayout>
		</footer>
	);
}

const SocialIcon = ({ d, color }: { d: string; color: string }) => (
	<div className="hover:bg-accent flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all active:scale-95">
		<svg className="h-6 w-6" style={{ fill: color }} viewBox="0 0 24 24">
			<path d={d} />
		</svg>
	</div>
);
