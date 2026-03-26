"use client";

import React, { useCallback, useMemo, useState } from "react";
import { FilterIcon } from "lucide-react";
import { Sheet, SheetContent, Button, DialogTitle, ToggleGroup, ToggleGroupItem } from "@ui";
import { ProductFilter } from "./ProductFilter";
import { useAddQueryParams } from "@/lib/hooks";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";

type ProductSortProps = {
	resultCount?: number;
};

const ProductSort = ({ resultCount }: ProductSortProps) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const { setParams, parseParamUrl } = useAddQueryParams();
	const { sortBy } = parseParamUrl();
	const quicksortValue = `${sortBy?.field}-${sortBy?.direction}`;

	const itemToggles = useMemo(
		() => [
			{ label: "Phổ biến", value: `${ProductOrderField.Rating}-${OrderDirection.Desc}` },
			{ label: "Mới nhất", value: `${ProductOrderField.PublicationDate}-${OrderDirection.Desc}` },
			{ label: "Giá thấp - cao", value: `${ProductOrderField.MinimalPrice}-${OrderDirection.Asc}` },
			{ label: "Giá cao - thấp", value: `${ProductOrderField.MinimalPrice}-${OrderDirection.Desc}` }
		],
		[]
	);

	const handleToggleChange = useCallback(
		(value: string) => {
			let param = {
				field: ProductOrderField.PublicationDate,
				direction: OrderDirection.Desc
			};
			if (value) {
				const [field, direction] = value.split("-") as [ProductOrderField, OrderDirection];
				param = {
					field,
					direction
				};
			}
			setParams({ sortBy: param });
		},
		[setParams]
	);

	const handleModalClose = () => {
		setOpen(false);
	};

	return (
		<div className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
			<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
				{/* Result Count */}
				{resultCount !== undefined && (
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-gray-900">{resultCount}</span>
						<span className="text-sm text-gray-500">sản phẩm</span>
					</div>
				)}

				{/* Sort Options */}
				<div className="flex flex-1 items-center gap-2 sm:gap-4">
					<span className="text-muted-foreground hidden text-sm font-medium md:block">Sắp xếp:</span>
					<div
						className="flex flex-1 items-center gap-2 overflow-auto p-1 md:gap-3"
						style={{ scrollbarWidth: "none" }}
					>
						<ToggleGroup
							type="single"
							className="md:gap-3"
							value={quicksortValue}
							onValueChange={handleToggleChange}
						>
							{itemToggles.map((item, index) => (
								<ToggleGroupItem
									className="data-[state=on]:bg-foreground data-[state=on]:text-background rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all"
									key={index}
									value={item.value}
								>
									{item.label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>
				</div>
			</div>
			<div className="block sm:hidden">
				<Sheet open={isOpen} modal>
					<Button variant="icon" size="icon" onClick={() => setOpen(true)}>
						<FilterIcon size={20} />
					</Button>
					<SheetContent side={"bottom"} onCloseMenu={handleModalClose}>
						<DialogTitle></DialogTitle>
						<ProductFilter onClickBtnSubmit={handleModalClose} />
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};

export { ProductSort };
