"use client";

import { cn } from "@/lib/utils";
import { useAddQueryParams } from "@/lib/hooks";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";

const SORT_OPTIONS = [
	{ label: "Nổi bật", field: ProductOrderField.Rating, direction: OrderDirection.Desc },
	{ label: "Giá tăng dần", field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc },
	{ label: "Giá giảm dần", field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc },
	{ label: "Mới nhất", field: ProductOrderField.PublishedAt, direction: OrderDirection.Desc }
] as const;

const ProductSortBar = () => {
	const { setParams, parseParamUrl } = useAddQueryParams();
	const { sortBy } = parseParamUrl();
	const activeField = sortBy?.field as string | undefined;
	const activeDir = sortBy?.direction as string | undefined;

	const handleSort = (field: ProductOrderField, direction: OrderDirection) => {
		setParams({ sortBy: { field, direction } });
	};

	return (
		<div className="sticky top-[72px] z-10 mb-5 border-b border-gray-100 bg-white/95 py-2 backdrop-blur-sm">
			<div className="flex flex-wrap items-center">
				<span className="mr-3 text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase">
					Sắp xếp:
				</span>
				{SORT_OPTIONS.map((opt, i) => {
					const isActive = activeField === opt.field && activeDir === opt.direction;
					return (
						<span key={opt.label} className="flex items-center">
							{i > 0 && <span className="mx-2 text-gray-200">•</span>}
							<button
								type="button"
								onClick={() => handleSort(opt.field, opt.direction)}
								className={cn(
									"py-1 text-[13px] font-medium transition-colors",
									isActive
										? "font-semibold text-red-600"
										: "text-gray-500 hover:text-gray-900"
								)}
							>
								{opt.label}
							</button>
						</span>
					);
				})}
			</div>
		</div>
	);
};

export { ProductSortBar };
