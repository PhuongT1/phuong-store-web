"use client";

import { type UseFormReturn } from "react-hook-form";
import {
	Button,
	InputField,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	Checkbox,
	Label,
	RadioGroup,
	RadioGroupItem,
} from "@components/ui";
import { StockAvailability } from "@/gql/graphql";
import { type ProductFilterForm } from "@/hooks/useProductFilter";

type FormMethods = UseFormReturn<ProductFilterForm>;
type SectionProps = { methods: FormMethods; submit: ReturnType<FormMethods["handleSubmit"]> };

const TRIGGER_CLS =
	"text-foreground py-3 text-[13px] font-semibold tracking-[0.08em] uppercase hover:no-underline";
const ITEM_CLS = "border-b-0 py-2";

const PRICE_PRESETS = [
	{ label: "Dưới 100k", value: "0-100000" },
	{ label: "100k - 500k", value: "100000-500000" },
	{ label: "Trên 500k", value: "500000-999999999" },
];

const FilterPriceSection = ({ methods, submit }: SectionProps) => (
	<AccordionItem value="price" className={ITEM_CLS}>
		<AccordionTrigger className={TRIGGER_CLS}>
			<span>Mức giá</span>
		</AccordionTrigger>
		<AccordionContent className="pt-2">
			<div className="flex flex-col gap-3">
				<RadioGroup
					name="tempPrice"
					className="flex flex-col gap-2"
					onValueChange={(value) => {
						const [min, max] = value.split("-");
						methods.setValue("minimalPrice", { gte: Number(min), lte: Number(max) }, { shouldDirty: true });
					}}
				>
					{PRICE_PRESETS.map((item) => (
						<div key={item.value} className="group flex items-center space-x-2">
							<RadioGroupItem value={item.value} id={`price-${item.value}`} />
							<Label
								htmlFor={`price-${item.value}`}
								className="text-muted-foreground group-hover:text-foreground cursor-pointer text-sm font-normal transition-colors"
							>
								{item.label}
							</Label>
						</div>
					))}
				</RadioGroup>
				<p className="text-muted-foreground/70 text-[10px] font-medium tracking-[0.1em] uppercase">
					Khoảng giá tùy chỉnh
				</p>
				<div className="flex items-center overflow-hidden rounded-md border border-input">
					<div className="min-w-0 flex-1">
						<InputField
							inputProps={{
								...methods.register("minimalPrice.gte", {
									setValueAs: (v: string) => (v === "" ? undefined : Number(v)),
								}),
								placeholder: "Tối thiểu",
								allowNegative: false,
								className: "border-0 rounded-none shadow-none focus-visible:ring-0",
							}}
						/>
					</div>
					<span className="text-muted-foreground shrink-0 select-none px-1 text-sm">—</span>
					<div className="min-w-0 flex-1">
						<InputField
							inputProps={{
								...methods.register("minimalPrice.lte", {
									setValueAs: (v: string) => (v === "" ? undefined : Number(v)),
								}),
								placeholder: "Tối đa",
								allowNegative: false,
								className: "border-0 rounded-none shadow-none focus-visible:ring-0",
							}}
						/>
					</div>
				</div>
				<Button
					className="w-full rounded-md font-medium"
					type="button"
					onClick={() => void submit()}
					size="sm"
					variant="outline"
				>
					Áp dụng
				</Button>
			</div>
		</AccordionContent>
	</AccordionItem>
);

const FilterStockSection = ({ methods }: Pick<SectionProps, "methods">) => {
	const stockAvailability = methods.watch("stockAvailability");
	const toggle = () =>
		methods.setValue(
			"stockAvailability",
			stockAvailability === StockAvailability.InStock ? undefined : StockAvailability.InStock,
			{ shouldDirty: true },
		);
	return (
		<AccordionItem value="stock" className={ITEM_CLS}>
			<AccordionTrigger className={TRIGGER_CLS}>
				<span>Tình trạng</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2">
				<div className="group flex cursor-pointer items-center space-x-2" onClick={toggle}>
					<Checkbox
						id="in-stock"
						checked={stockAvailability === StockAvailability.InStock}
						onCheckedChange={(checked) =>
							methods.setValue(
								"stockAvailability",
								checked ? StockAvailability.InStock : undefined,
								{ shouldDirty: true },
							)
						}
					/>
					<Label
						htmlFor="in-stock"
						className="text-muted-foreground group-hover:text-foreground cursor-pointer text-sm font-normal transition-colors"
					>
						Còn hàng
					</Label>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

export { FilterPriceSection, FilterStockSection };
