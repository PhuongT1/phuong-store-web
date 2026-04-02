"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ProductListByCategoryPaginatedQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui";

type CategoryHeroProps = {
	category: ProductListByCategoryPaginatedQuery["category"];
};

const CategoryHero = ({ category }: CategoryHeroProps) => {
	const t = useTranslations("category");
	if (!category) return null;

	// Rotate through vibrant gradients based on category id hash
	const colorThemes = [
		"from-rose-600 via-pink-500 to-orange-400",
		"from-sky-600 via-blue-500 to-indigo-600",
		"from-emerald-600 via-teal-500 to-cyan-500",
		"from-violet-600 via-purple-500 to-fuchsia-500",
		"from-amber-500 via-orange-500 to-red-500"
	];
	const themeIndex = category.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % colorThemes.length;
	const gradient = colorThemes[themeIndex];

	return (
		<section
			className={cn("relative h-[400px] w-full overflow-hidden bg-linear-to-br md:h-[500px]", gradient)}
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3di03aC03djd6bTE0IDBINDd2LTdoN3Y3em0tMjggMGg3di03aC03djd6bTE0IDBIMzN2LTdoN3Y3em0tMTQgMTRoN3YtN2gtN3Y3em0xNCAwaDd2LTdoLTd2N3ptLTE0IDE0aDd2LTdoLTd2N3ptMTQgMGg3di03aC03djd6bS0xNCAxNGg3di03aC03djd6bTE0IDBoN3YtN2gtN3Y3eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/30"></div>

			{/* Content */}
			<div className="relative mx-auto flex h-full max-w-[1920px] items-center px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl">
					<div className="mb-4 inline-block rounded-full bg-hero-surface px-4 py-1.5 text-xs font-semibold tracking-wider text-hero-text-muted uppercase backdrop-blur-sm">
						{t("newCollection")}
					</div>

					<h1 className="mb-4 text-4xl font-bold tracking-tight text-hero-text md:text-5xl lg:text-6xl">
						{category.name}
					</h1>

					{category.description && (
						<p className="mb-8 max-w-lg text-base leading-relaxed text-hero-text-muted md:text-lg">
							{category.description}
						</p>
					)}

					{!category.description && (
						<p className="mb-8 max-w-lg text-base leading-relaxed text-hero-text-muted md:text-lg">
							{t("heroDescription", { name: category.name.toLowerCase() })}{" "}
							<span className="font-semibold text-hero-text">
								{category.products?.totalCount || 0} {t("productCount")}
							</span>
						</p>
					)}

					<div className="flex flex-wrap items-center gap-4">
						<Button
							size="lg"
							className="group rounded-lg bg-hero-btn-bg px-8 py-6 font-semibold text-hero-btn-text shadow-xl transition-all hover:bg-hero-btn-bg/90 hover:shadow-2xl"
						>
							{t("exploreNow")}
							<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Button>

						<div className="flex items-center gap-3 rounded-lg bg-hero-surface px-6 py-4 backdrop-blur-sm">
							<div className="text-center">
								<div className="text-3xl font-bold text-hero-text">{category.products?.totalCount || 0}</div>
								<div className="text-xs font-medium tracking-wider text-hero-text-dim uppercase">
									{t("productCount")}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-1/2 right-8 hidden -translate-y-1/2 lg:block">
					<div className="relative h-80 w-80">
						<div className="absolute inset-0 animate-pulse rounded-full bg-hero-surface blur-3xl"></div>
						<div className="absolute inset-4 animate-pulse rounded-full bg-hero-surface/15 blur-2xl"></div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
				}
			`}</style>
		</section>
	);
};

export { CategoryHero };
