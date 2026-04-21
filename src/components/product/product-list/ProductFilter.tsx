"use client";

import { useTranslations } from "next-intl";
import { useProductFilter } from "@/hooks/useProductFilter";
import { Button, Accordion, FormProvider, Scrollbar } from "@components/ui";
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

	const isMobile = !!onClickBtnSubmit;
	const shouldAutoSubmit = !isMobile;

	return (
		<aside
			className={`flex flex-col overflow-hidden ${
				!isMobile
					? "surface-panel sticky top-[calc(var(--header-height,88px)+1.5rem)] z-10 max-h-[calc(100vh-var(--header-height,88px)-1.5rem+var(--header-shift,0px))] [transform:translate3d(0,calc(var(--header-shift,0px)*-1),0)] transition-transform duration-300 ease-in-out will-change-transform motion-reduce:transition-none"
					: "h-full min-h-0"
			}`}
		>
			{/* Desktop header — hidden in mobile sheet (sheet has its own) */}
			{!isMobile && (
				<div className="border-border/65 bg-card/90 flex shrink-0 items-center justify-between rounded-t-2xl border-b px-4 py-3">
					<h2 className="text-foreground text-[12px] font-semibold tracking-[0.14em] uppercase sm:text-[13px]">
						{t("title")}
					</h2>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleReset}
						className="text-muted-foreground hover:text-foreground hover:bg-accent h-8 rounded-lg px-3 text-[10px] sm:text-[11px] font-medium tracking-[0.1em] uppercase transition-colors"
					>
						{t("reset")}
					</Button>
				</div>
			)}

			<FormProvider methods={methods} formProps={{ onSubmit: submit, className: "flex h-full min-h-0 flex-1 flex-col" }}>
				{/* Scrollable content */}
				{isMobile ? (
					<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
						<div className="overscroll-contain px-3 pb-1.5 pt-0">
							<Accordion
								type="multiple"
								defaultValue={["price", "stock", "brand", "size", "color"]}
								className="w-full"
							>
								<FilterPriceSection methods={methods} submit={submit} autoSubmit={shouldAutoSubmit} />
								<FilterStockSection methods={methods} submit={submit} autoSubmit={shouldAutoSubmit} />
								<FilterBrandSection
									methods={methods}
									submit={submit}
									autoSubmit={shouldAutoSubmit}
									options={brandOptions}
									isLoading={isAttrLoading}
								/>
								<FilterSizeSection
									methods={methods}
									submit={submit}
									autoSubmit={shouldAutoSubmit}
									options={sizeOptions}
									isLoading={isAttrLoading}
								/>
								<FilterColorSection
									methods={methods}
									submit={submit}
									autoSubmit={shouldAutoSubmit}
									options={colorOptions}
									isLoading={isAttrLoading}
								/>
							</Accordion>
						</div>
					</div>
				) : (
					<Scrollbar className="min-h-0 flex-1 overscroll-contain" autoHide={false}>
						<div className="overscroll-contain px-4 pb-4 pt-1">
							<Accordion
								type="multiple"
								defaultValue={["price", "stock", "brand", "size", "color"]}
								className="w-full"
							>
								<FilterPriceSection methods={methods} submit={submit} autoSubmit={shouldAutoSubmit} />
								<FilterStockSection methods={methods} submit={submit} autoSubmit={shouldAutoSubmit} />
								<FilterBrandSection
									methods={methods}
									submit={submit}
									autoSubmit={shouldAutoSubmit}
									options={brandOptions}
									isLoading={isAttrLoading}
								/>
								<FilterSizeSection
									methods={methods}
									submit={submit}
									autoSubmit={shouldAutoSubmit}
									options={sizeOptions}
									isLoading={isAttrLoading}
								/>
								<FilterColorSection
									methods={methods}
									submit={submit}
									autoSubmit={shouldAutoSubmit}
									options={colorOptions}
									isLoading={isAttrLoading}
								/>
							</Accordion>
						</div>
					</Scrollbar>
				)}

				{/* Mobile: sticky Apply + Clear buttons pinned to bottom */}
				{isMobile && (
					<div className="bg-popover/96 border-border/70 sticky bottom-0 z-10 flex gap-2 border-t px-3 pt-1 pb-[max(6px,env(safe-area-inset-bottom))] backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_28px_rgba(0,0,0,0.26)]">
						<Button
							type="button"
							variant="outline"
							size="base"
							onClick={handleReset}
							className="h-[38px] flex-1 rounded-xl px-3.5 text-[13px] font-semibold sm:h-11 sm:text-sm"
						>
							{t("reset")}
						</Button>
						<Button
							className="h-[38px] flex-[2] rounded-xl px-3.5 text-[13px] font-semibold sm:h-11 sm:text-sm"
							onClick={() => {
								void submit();
								onClickBtnSubmit();
							}}
							type="button"
							variant="default"
							size="base"
						>
							{t("applyMobile")}
						</Button>
					</div>
				)}
			</FormProvider>
		</aside>
	);
};

export { ProductFilter };
