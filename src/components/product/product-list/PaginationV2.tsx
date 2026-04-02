import { clsx } from "clsx";
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
	maxPagesToShow = 5
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
		<nav className="border-border flex items-center justify-center gap-x-4 px-4 pt-12">
			<LinkWithChannel
				href={hasPreviousPage ? generatePageLink(currentPage - 1) : "#"}
				className={clsx("px-4 py-2 text-sm font-medium", {
					"bg-foreground text-background hover:bg-foreground/90 rounded": hasPreviousPage,
					"text-muted-foreground pointer-events-none cursor-not-allowed rounded border": !hasPreviousPage
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
								"relative h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all select-none",
								"text-foreground hover:bg-foreground/10 active:bg-foreground/20"
							)}
						>
							<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">1</span>
						</LinkWithChannel>
						<span className="text-foreground">...</span>
					</>
				)}
				{Array.from({ length: endPage - startPage + 1 }, (_, index) => (
					<LinkWithChannel
						key={startPage + index}
						href={generatePageLink(startPage + index)}
						className={clsx(
							"relative h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all select-none",
							{
								"bg-foreground text-background shadow-foreground/10 hover:shadow-foreground/20 shadow-md hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none":
									currentPage === startPage + index,
								"text-foreground hover:bg-foreground/10 active:bg-foreground/20":
									currentPage !== startPage + index
							}
						)}
					>
						<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
							{startPage + index}
						</span>
					</LinkWithChannel>
				))}
				{showEndEllipsis && (
					<>
						<span className="text-foreground">...</span>
						<LinkWithChannel
							href={generatePageLink(totalPages)}
							className={clsx(
								"relative h-10 max-h-[40px] w-10 max-w-[40px] rounded-full text-center align-middle font-sans text-xs font-medium uppercase transition-all select-none",
								"text-foreground hover:bg-foreground/10 active:bg-foreground/20"
							)}
						>
							<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								{totalPages}
							</span>
						</LinkWithChannel>
					</>
				)}
			</div>
			<LinkWithChannel
				href={hasNextPage ? generatePageLink(currentPage + 1) : "#"}
				className={clsx("px-4 py-2 text-sm font-medium", {
					"bg-foreground text-background hover:bg-foreground/90 rounded": hasNextPage,
					"text-muted-foreground pointer-events-none cursor-not-allowed rounded border": !hasNextPage
				})}
				aria-disabled={!hasNextPage}
			>
				Next
			</LinkWithChannel>
		</nav>
	);
}
