"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";
import { type AttributeValueNode } from "@/hooks/useAttributeValues";
import { type ProductFilterForm } from "@/hooks/useProductFilter";
import { cn } from "@/lib/utils";
import { AccordionItem, AccordionTrigger, AccordionContent, Checkbox, Label } from "@components/ui";

type FormMethods = UseFormReturn<ProductFilterForm>;
type SectionProps = { methods: FormMethods; submit: ReturnType<FormMethods["handleSubmit"]> };
type AttrSectionProps = SectionProps & { options: AttributeValueNode[]; isLoading: boolean };

const TRIGGER_CLS =
	"text-foreground py-3 text-[13px] font-semibold tracking-[0.08em] uppercase hover:no-underline";
const ITEM_CLS = "border-b-0 py-2";
const CLEAR_BTN_CLS =
	"text-muted-foreground hover:text-foreground shrink-0 px-2 py-1 text-[11px] font-medium tracking-[0.08em] uppercase transition-colors rounded";

const FilterBrandSection = ({ methods, submit, options, isLoading }: AttrSectionProps) => {
	const t = useTranslations("filter");
	const selectedBrands = methods.watch("brand");
	return (
		<AccordionItem value="brand" className={ITEM_CLS}>
			<AccordionTrigger
				className={TRIGGER_CLS}
				action={
					selectedBrands?.length > 0 ? (
						<button
							type="button"
							onClick={() => {
								methods.setValue("brand", [], { shouldDirty: true });
								void submit();
							}}
							className={CLEAR_BTN_CLS}
						>
							{t("reset")}
						</button>
					) : undefined
				}
			>
				<span>{t("brand")}</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="scrollbar-hide flex max-h-48 flex-col gap-3 overflow-y-auto pr-2">
					{isLoading ? (
						[1, 2, 3].map((i) => <div key={i} className="bg-muted h-5 w-32 animate-pulse rounded" />)
					) : options.length === 0 ? (
						<p className="text-muted-foreground text-xs">{t("noBrands")}</p>
					) : (
						options.map((brand) => {
							const slug = brand.slug ?? "";
							return (
								<div key={slug} className="group flex cursor-pointer items-center space-x-2">
									<Checkbox
										id={`brand-${slug}`}
										checked={selectedBrands?.includes(slug)}
										onCheckedChange={(checked) => {
											const cur = selectedBrands ?? [];
											methods.setValue("brand", checked ? [...cur, slug] : cur.filter((b) => b !== slug), {
												shouldDirty: true
											});
										void submit();
          }}
									/>
									<Label
										htmlFor={`brand-${slug}`}
										className="text-muted-foreground group-hover:text-foreground cursor-pointer text-sm font-normal transition-colors"
									>
										{brand.name}
									</Label>
								</div>
							);
						})
					)}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

const FilterSizeSection = ({ methods, submit, options, isLoading }: AttrSectionProps) => {
	const t = useTranslations("filter");
	const selectedSizes = methods.watch("size");
	return (
		<AccordionItem value="size" className={ITEM_CLS}>
			<AccordionTrigger
				className={TRIGGER_CLS}
				action={
					selectedSizes?.length > 0 ? (
						<button
							type="button"
							onClick={() => {
								methods.setValue("size", [], { shouldDirty: true });
								void submit();
							}}
							className={CLEAR_BTN_CLS}
						>
							{t("reset")}
						</button>
					) : undefined
				}
			>
				<span>{t("size")}</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="flex flex-wrap gap-2">
					{isLoading ? (
						[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="bg-muted h-10 w-12 animate-pulse rounded-md" />
						))
					) : options.length === 0 ? (
						<p className="text-muted-foreground text-xs">{t("noSizes")}</p>
					) : (
						options.map((sizeItem) => {
							const slug = sizeItem.slug ?? "";
							const isActive = selectedSizes?.includes(slug);
							return (
								<button
									key={slug}
									type="button"
									onClick={() => {
										const cur = selectedSizes ?? [];
										methods.setValue(
											"size",
											cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug],
											{ shouldDirty: true }
										);
                                                                            void submit();
                                                                            }}
									className={cn(
										"flex h-10 min-w-[48px] items-center justify-center rounded-md border px-3 text-sm font-medium transition-all",
										isActive
											? "border-info/50 bg-info/10 text-info font-semibold"
											: "border-border text-muted-foreground hover:border-muted-foreground hover:bg-secondary hover:text-foreground"
									)}
								>
									{sizeItem.name}
								</button>
							);
						})
					)}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

const FilterColorSection = ({ methods, submit, options, isLoading }: AttrSectionProps) => {
	const t = useTranslations("filter");
	const selectedColors = methods.watch("color");
	return (
		<AccordionItem value="color" className={ITEM_CLS}>
			<AccordionTrigger
				className={TRIGGER_CLS}
				action={
					selectedColors?.length > 0 ? (
						<button
							type="button"
							onClick={() => {
								methods.setValue("color", [], { shouldDirty: true });
								void submit();
							}}
							className={CLEAR_BTN_CLS}
						>
							{t("reset")}
						</button>
					) : undefined
				}
			>
				<span>{t("color")}</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="flex flex-wrap gap-3">
					{isLoading ? (
						[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="bg-muted h-10 w-10 animate-pulse rounded-full" />
						))
					) : options.length === 0 ? (
						<p className="text-muted-foreground text-xs">{t("noColors")}</p>
					) : (
						options.map((colorItem) => {
							const slug = colorItem.slug ?? "";
							const isSelected = selectedColors?.includes(slug);
							return (
								<button
									key={slug}
									type="button"
									title={colorItem.name ?? slug}
									onClick={() => {
										const cur = selectedColors ?? [];
										methods.setValue(
											"color",
											cur.includes(slug) ? cur.filter((c) => c !== slug) : [...cur, slug],
											{ shouldDirty: true }
										);
                                                                            void submit();
                                                                            }}
									className={cn(
										"group relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
										isSelected ? "border-primary" : "border-border hover:border-primary"
									)}
								>
									{colorItem.value ? (
										<span
											className="border-border h-7 w-7 rounded-full border"
											style={{ backgroundColor: colorItem.value }}
										/>
									) : (
										<span className="text-muted-foreground text-[10px] leading-tight font-medium">
											{(colorItem.name ?? slug).slice(0, 3)}
										</span>
									)}
								</button>
							);
						})
					)}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

export { FilterBrandSection, FilterSizeSection, FilterColorSection };
