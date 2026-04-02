import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { type SearchProductsQuery } from "@/gql/graphql";
import { LinkWithChannel } from "@components/navigation";

type PaginationProps = {
	pageInfo: { basePathname: string; hasNextPage: boolean; readonly urlSearchParams?: URLSearchParams };
} & Pick<NonNullable<SearchProductsQuery["products"]>, "totalCount">;

const Pagination = async ({ pageInfo, totalCount }: PaginationProps) => {
	const t = await getTranslations("cart");
	return (
		<nav className="border-border flex items-center justify-center gap-x-4 px-4 pt-8">
			<LinkWithChannel
				href={pageInfo.hasNextPage ? `${pageInfo.basePathname}?${pageInfo.urlSearchParams?.toString()}` : "#"}
				className={clsx("item-center flex gap-1 rounded-3xl border px-4 py-2 text-sm font-medium", {
					"bg-card text-foreground hover:bg-card/40 rounded": pageInfo.hasNextPage,
					"text-muted-foreground cursor-not-allowed": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				{t("loadMore")}
				<ChevronDown className="h-5 w-5" />
			</LinkWithChannel>
		</nav>
	);
};

export { Pagination };
