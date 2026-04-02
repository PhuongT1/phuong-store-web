"use client";

import { useTranslations } from "next-intl";
import { useProductFilter } from "@/hooks/useProductFilter";
import { Button, Accordion, FormProvider } from "@components/ui";
import {
	FilterPriceSection,
	FilterStockSection,
	FilterBrandSection,
	FilterSizeSection,
	FilterColorSection
} from "./ProductFilterSections";

type ProductFilterProps = {
	onClickBtnSubmit?: () => void;
};

const ProductFilter = ({ onClickBtnSubmit }: ProductFilterProps) => {
	const t = useTranslations("filter");
	const { methods, submit, handleReset, isAttrLoading, brandOptions, sizeOptions, colorOptions } =
		useProductFilter();

	return (
		<aside className="h-full overflow-hidden md:sticky md:top-(--header-height) md:z-10 md:h-[calc(100vh-var(--header-height)-8px)]">
			<div className="bg-card flex h-full flex-col overflow-hidden rounded-xl shadow-sm">
				{/* Sticky filter header */}
				<div className="border-border bg-card flex shrink-0 items-center justify-between border-b px-4 py-3">
					<h2 className="text-foreground text-[13px] font-semibold tracking-[0.12em] uppercase">
						{t("title")}
					</h2>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleReset}
						className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 rounded-md px-2.5 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors"
					>
						{t("reset")}
					</Button>
				</div>

				{/* Scrollable content */}
				<div
					className="[&::-webkit-scrollbar-thumb]:bg-border flex-1 overflow-y-auto overscroll-contain px-4 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
					style={{ scrollbarWidth: "thin" }}
				>
					<FormProvider methods={methods} formProps={{ className: "flex flex-col gap-4", onSubmit: submit }}>
						<Accordion
							type="multiple"
							defaultValue={["price", "stock", "brand", "size", "color"]}
							className="w-full"
						>
							<FilterPriceSection methods={methods} submit={submit} />
							<FilterStockSection methods={methods} submit={submit} />
							<FilterBrandSection
								methods={methods}
								submit={submit}
								options={brandOptions}
								isLoading={isAttrLoading}
							/>
							<FilterSizeSection
								methods={methods}
								submit={submit}
								options={sizeOptions}
								isLoading={isAttrLoading}
							/>
							<FilterColorSection
								methods={methods}
								submit={submit}
								options={colorOptions}
								isLoading={isAttrLoading}
							/>
						</Accordion>
						<Button
							className="shadow-primary/20 mt-2 block w-full rounded-md font-semibold shadow-md md:hidden"
							onClick={onClickBtnSubmit}
							type="submit"
							variant="default"
							size="base"
						>
							{t("applyMobile")}
						</Button>
					</FormProvider>
				</div>
			</div>
		</aside>
	);
};

export { ProductFilter };
