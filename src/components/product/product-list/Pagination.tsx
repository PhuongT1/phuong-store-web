import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { LinkWithChannel } from "@components/navigation";
import { type SearchProductsQuery } from "@/gql/graphql";

type PaginationProps = {
	pageInfo: { basePathname: string; hasNextPage: boolean; readonly urlSearchParams?: URLSearchParams };
} & Pick<NonNullable<SearchProductsQuery["products"]>, "totalCount">;

const Pagination = async ({ pageInfo, totalCount }: PaginationProps) => {
	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-8">
			<LinkWithChannel
				href={pageInfo.hasNextPage ? `${pageInfo.basePathname}?${pageInfo.urlSearchParams?.toString()}` : "#"}
				className={clsx("item-center flex gap-1 rounded-3xl border px-4 py-2 text-sm font-medium", {
					"rounded bg-white text-neutral-900 hover:bg-white/40": pageInfo.hasNextPage,
					"cursor-not-allowed  text-neutral-400": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Xem thêm kết quả
				<ChevronDown className="h-5 w-5" />
			</LinkWithChannel>
		</nav>
	);
};

export { Pagination };
