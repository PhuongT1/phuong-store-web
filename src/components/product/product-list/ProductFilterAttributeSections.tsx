"use client";

import { type UseFormReturn } from "react-hook-form";
import {
	Button,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	Checkbox,
	Label,
} from "@components/ui";
import { type AttributeValueNode } from "@/hooks/useAttributeValues";
import { type ProductFilterForm } from "@/hooks/useProductFilter";
import { cn } from "@/lib/utils";

type FormMethods = UseFormReturn<ProductFilterForm>;
type SectionProps = { methods: FormMethods; submit: ReturnType<FormMethods["handleSubmit"]> };
type AttrSectionProps = SectionProps & { options: AttributeValueNode[]; isLoading: boolean };

const TRIGGER_CLS =
	"text-foreground py-3 text-[13px] font-semibold tracking-[0.08em] uppercase hover:no-underline";
const ITEM_CLS = "border-b-0 py-2";

const FilterBrandSection = ({ methods, submit, options, isLoading }: AttrSectionProps) => {
	const selectedBrands = methods.watch("brand");
	return (
		<AccordionItem value="brand" className={ITEM_CLS}>
			<AccordionTrigger className={TRIGGER_CLS}>
				<span>Thương hiệu</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="scrollbar-hide flex max-h-48 flex-col gap-3 overflow-y-auto pr-2">
					{isLoading ? (
						[1, 2, 3].map((i) => <div key={i} className="h-5 w-32 animate-pulse rounded bg-gray-200" />)
					) : options.length === 0 ? (
						<p className="text-muted-foreground text-xs">Không có thương hiệu</p>
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
											methods.setValue(
												"brand",
												checked ? [...cur, slug] : cur.filter((b) => b !== slug),
												{ shouldDirty: true },
											);
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
				<Button
					className="mt-4 w-full rounded-md font-medium"
					type="button"
					onClick={() => void submit()}
					size="sm"
					variant="outline"
				>
					Lọc thương hiệu
				</Button>
			</AccordionContent>
		</AccordionItem>
	);
};

const FilterSizeSection = ({ methods, submit, options, isLoading }: AttrSectionProps) => {
	const selectedSizes = methods.watch("size");
	return (
		<AccordionItem value="size" className={ITEM_CLS}>
			<AccordionTrigger className={TRIGGER_CLS}>
				<span>Kích thước</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="flex flex-wrap gap-2">
					{isLoading ? (
						[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-10 w-12 animate-pulse rounded-md bg-gray-200" />
						))
					) : options.length === 0 ? (
						<p className="text-muted-foreground text-xs">Không có kích thước</p>
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
											{ shouldDirty: true },
										);
									}}
									className={cn(
										"flex h-10 min-w-[48px] items-center justify-center rounded-md border px-3 text-sm font-medium transition-all",
										isActive
											? "border-gray-900 bg-gray-100 text-gray-900"
											: "border-gray-300 text-muted-foreground hover:border-foreground hover:bg-gray-50 hover:text-foreground",
									)}
								>
									{sizeItem.name}
								</button>
							);
						})
					)}
				</div>
				<Button
					className="mt-4 w-full rounded-md font-medium"
					type="button"
					onClick={() => void submit()}
					size="sm"
					variant="outline"
				>
					Lọc kích thước
				</Button>
			</AccordionContent>
		</AccordionItem>
	);
};

const FilterColorSection = ({ methods, submit, options, isLoading }: AttrSectionProps) => {
	const selectedColors = methods.watch("color");
	return (
		<AccordionItem value="color" className={ITEM_CLS}>
			<AccordionTrigger className={TRIGGER_CLS}>
				<span>Màu sắc</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="flex flex-wrap gap-3">
					{isLoading ? (
						[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
						))
					) : options.length === 0 ? (
						<p className="text-muted-foreground text-xs">Không có màu sắc</p>
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
											{ shouldDirty: true },
										);
									}}
									className={cn(
										"group relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
										isSelected ? "border-gray-900" : "border-gray-300 hover:border-gray-900",
									)}
								>
									{colorItem.value ? (
										<span
											className="h-7 w-7 rounded-full border border-gray-200"
											style={{ backgroundColor: colorItem.value }}
										/>
									) : (
										<span className="text-[10px] font-medium leading-tight text-gray-700">
											{(colorItem.name ?? slug).slice(0, 3)}
										</span>
									)}
								</button>
							);
						})
					)}
				</div>
				<Button
					className="mt-4 w-full rounded-md font-medium"
					type="button"
					onClick={() => void submit()}
					size="sm"
					variant="outline"
				>
					Lọc màu sắc
				</Button>
			</AccordionContent>
		</AccordionItem>
	);
};

export { FilterBrandSection, FilterSizeSection, FilterColorSection };
