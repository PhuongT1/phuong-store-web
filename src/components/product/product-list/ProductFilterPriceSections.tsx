"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";
import { StockAvailability } from "@/gql/graphql";
import { type ProductFilterForm } from "@/hooks/useProductFilter";
import {
	Button,
	InputField,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	Checkbox,
	Label,
	RadioGroup,
	RadioGroupItem
} from "@components/ui";

type FormMethods = UseFormReturn<ProductFilterForm>;
type SectionProps = { methods: FormMethods; submit: ReturnType<FormMethods["handleSubmit"]> };

const TRIGGER_CLS =
	"text-foreground py-3 text-[13px] font-semibold tracking-[0.08em] uppercase hover:no-underline";
const ITEM_CLS = "border-b-0 py-2";
const CLEAR_BTN_CLS =
	"text-muted-foreground hover:text-foreground shrink-0 px-2 py-1 text-[11px] font-medium tracking-[0.08em] uppercase transition-colors rounded";

const PRICE_PRESETS = [
	{ key: "priceUnder100k" as const, value: "0-100000" },
	{ key: "price100to500k" as const, value: "100000-500000" },
	{ key: "priceOver500k" as const, value: "500000-999999999" }
];

const FilterPriceSection = ({ methods, submit }: SectionProps) => {
	const t = useTranslations("filter");
	const tc = useTranslations("common");
	const tempPrice = methods.watch("tempPrice");
	const minPrice = methods.watch("minimalPrice");
	const hasAnyPrice = !!tempPrice || (minPrice.gte ?? 0) > 0 || (minPrice.lte ?? 0) > 0;

	const clearPrice = () => {
		methods.setValue("tempPrice", "", { shouldDirty: true });
		methods.setValue("minimalPrice", { gte: undefined, lte: undefined }, { shouldDirty: true });
		void submit();
	};

	return (
		<AccordionItem value="price" className={ITEM_CLS}>
			<AccordionTrigger
				className={TRIGGER_CLS}
				action={
					hasAnyPrice ? (
						<button type="button" onClick={clearPrice} className={CLEAR_BTN_CLS}>
							{t("reset")}
						</button>
					) : undefined
				}
			>
				<span>{t("price")}</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="flex flex-col gap-3">
					<RadioGroup
						name="tempPrice"
						value={tempPrice || ""}
						className="flex flex-col gap-2"
						onValueChange={(value) => {
							methods.setValue("tempPrice", value, { shouldDirty: true });
							const [min, max] = value.split("-");
							methods.setValue("minimalPrice", { gte: Number(min), lte: Number(max) }, { shouldDirty: true });
							void submit();
						}}
					>
						{PRICE_PRESETS.map((item) => (
							<div key={item.value} className="group flex items-center space-x-2">
								<RadioGroupItem value={item.value} id={`price-${item.value}`} />
								<Label
									htmlFor={`price-${item.value}`}
									className="text-muted-foreground group-hover:text-foreground cursor-pointer text-sm font-normal transition-colors"
								>
									{t(item.key)}
								</Label>
							</div>
						))}
					</RadioGroup>
					<p className="text-muted-foreground/70 text-[10px] font-medium tracking-[0.1em] uppercase">
						{t("customPrice")}
					</p>
					<div className="flex items-center gap-2">
						<div className="min-w-0 flex-1">
							<InputField
								inputProps={{
									...methods.register("minimalPrice.gte", {
										setValueAs: (v: string) => (v === "" ? undefined : Number(v))
									}),
									placeholder: t("priceMin"),
									allowNegative: false,
									className: "rounded-md shadow-none text-sm h-9"
								}}
							/>
						</div>
						<span className="text-muted-foreground shrink-0 text-sm select-none">—</span>
						<div className="min-w-0 flex-1">
							<InputField
								inputProps={{
									...methods.register("minimalPrice.lte", {
										setValueAs: (v: string) => (v === "" ? undefined : Number(v))
									}),
									placeholder: t("priceMax"),
									allowNegative: false,
									className: "rounded-md shadow-none text-sm h-9"
								}}
							/>
						</div>
					</div>
					<Button
						className="w-full rounded-md font-medium"
						type="button"
						onClick={() => void submit()}
						size="sm"
						variant="default"
					>
						{tc("apply")}
					</Button>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

const FilterStockSection = ({ methods, submit }: SectionProps) => {
	const t = useTranslations("filter");
	const stockAvailability = methods.watch("stockAvailability");
	return (
		<AccordionItem value="stock" className={ITEM_CLS}>
			<AccordionTrigger
				className={TRIGGER_CLS}
				action={
					stockAvailability === StockAvailability.InStock ? (
						<button
							type="button"
							onClick={() => {
								methods.setValue("stockAvailability", undefined, { shouldDirty: true });
								void submit();
							}}
							className={CLEAR_BTN_CLS}
						>
							{t("reset")}
						</button>
					) : undefined
				}
			>
				<span>{t("stock")}</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="group flex cursor-pointer items-center space-x-2">
					<Checkbox
						id="in-stock"
						checked={stockAvailability === StockAvailability.InStock}
						onCheckedChange={(checked) => {
							methods.setValue("stockAvailability", checked ? StockAvailability.InStock : undefined, {
								shouldDirty: true
							});
							void submit();
						}}
					/>
					<Label
						htmlFor="in-stock"
						className="text-muted-foreground group-hover:text-foreground cursor-pointer text-sm font-normal transition-colors"
					>
						{t("inStock")}
					</Label>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

export { FilterPriceSection, FilterStockSection };
