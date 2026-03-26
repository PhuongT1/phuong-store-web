import clsx from "clsx";
import { LinkWithChannel } from "@components/navigation";

interface PageInfo {
	basePathname: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	totalPages: number;
	currentPage: number;
	urlSearchParams?: URLSearchParams;
}

export function PaginationV2({
	pageInfo,
	maxPagesToShow = 5,
}: {
	pageInfo: PageInfo;
	maxPagesToShow?: number;
}) {
	const { basePathname, hasNextPage, hasPreviousPage, totalPages, urlSearchParams } = pageInfo;
	const currentPage = Number(pageInfo.currentPage);

	const generatePageLink = (page: number) => {
		const params = new URLSearchParams(urlSearchParams?.toString());
		params.set("page", page.toString());
		return `${basePathname}?${params.toString()}`;
	};

	if (totalPages <= 1) return null;

	const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
	let startPage = 1;
	let endPage = totalPages;

	if (totalPages > maxPagesToShow) {
		if (currentPage <= halfMaxPagesToShow) {
			startPage = 1;
			endPage = maxPagesToShow;
		} else if (currentPage + halfMaxPagesToShow >= totalPages) {
			startPage = totalPages - maxPagesToShow + 1;
			endPage = totalPages;
		} else {
			startPage = currentPage - halfMaxPagesToShow;
			endPage = currentPage + halfMaxPagesToShow;
		}
	}

	const showStartEllipsis = startPage > 1;
	const showEndEllipsis = endPage < totalPages;

	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<LinkWithChannel
				href={hasPreviousPage ? generatePageLink(currentPage - 1) : "#"}
				className={clsx("px-4 py-2 text-sm font-medium ", {
					"rounded bg-neutral-900 text-neutral-50 hover:bg-neutral-800": hasPreviousPage,
					"pointer-events-none cursor-not-allowed rounded border text-neutral-400": !hasPreviousPage,
				})}
				aria-disabled={!hasPreviousPage}
			>
				Previous
			</LinkWithChannel>
			<div className="flex items-center gap-2">
				{showStartEllipsis && (
					<>
						<LinkWithChannel
							href={generatePageLink(1)}
							className={clsx(
								"relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all",
								"text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20",
							)}
						>
							<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">1</span>
						</LinkWithChannel>
						<span className="text-gray-900">...</span>
					</>
				)}
				{Array.from({ length: endPage - startPage + 1 }, (_, index) => (
					<LinkWithChannel
						key={startPage + index}
						href={generatePageLink(startPage + index)}
						className={clsx(
							"relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all",
							{
								"bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none":
									currentPage === startPage + index,
								"text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20": currentPage !== startPage + index,
							},
						)}
					>
						<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
							{startPage + index}
						</span>
					</LinkWithChannel>
				))}
				{showEndEllipsis && (
					<>
						<span className="text-gray-900">...</span>
						<LinkWithChannel
							href={generatePageLink(totalPages)}
							className={clsx(
								"relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all",
								"text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20",
							)}
						>
							<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								{totalPages}
							</span>
						</LinkWithChannel>
					</>
				)}
			</div>
			<LinkWithChannel
				href={hasNextPage ? generatePageLink(currentPage + 1) : "#"}
				className={clsx("px-4 py-2 text-sm font-medium ", {
					"rounded bg-neutral-900 text-neutral-50 hover:bg-neutral-800": hasNextPage,
					"pointer-events-none cursor-not-allowed rounded border text-neutral-400": !hasNextPage,
				})}
				aria-disabled={!hasNextPage}
			>
				Next
			</LinkWithChannel>
		</nav>
	);
}
