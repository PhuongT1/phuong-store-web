import { type FC, useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { SummaryItemMoneySection } from "@/checkout/sections/order-summary/Summary/SummaryItemMoneySection";
import { type Checkout, type OrderLine } from "@/gql/graphql";
import { useCheckoutLines } from "@/hooks/checkout";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { cn } from "@/lib/utils";
import { Button, Card, Checkbox } from "@components/ui";
import { type CartLine, type CheckoutLineForm } from "../Cart.type";
import { Summary } from "./Summary";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { SummaryLineEdit, type SummaryLines } from "./SummaryLineEdit";

type SummaryListEditProps = {
	editable?: boolean;
	lines: CartLine[];
	classNameCard?: string;
} & Checkout;

const SummaryListEdit: FC<SummaryListEditProps> = ({ editable = true, lines, classNameCard, ...rest }) => {
	const { isTabletOrBelow } = useDeviceSize();
	const t = useTranslations("cart");
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const {
		deleteCart: { checkoutDelete, isDeleting }
	} = useCheckoutLines();

	const methods = useForm<SummaryLines>({
		values: { summaryList: (lines?.map((item) => ({ ...item, _id: item.id })) ?? []) as CheckoutLineForm[] }
	});
	const { control } = methods;

	const { fields } = useFieldArray({ control, name: "summaryList" });

	const allIds = fields.map((f) => f._id);
	const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
	const someSelected = selectedIds.size > 0;

	const handleToggleAll = () => {
		setSelectedIds(allSelected ? new Set() : new Set(allIds));
	};

	const handleToggle = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const handleDeleteSelected = () => {
		const ids = [...selectedIds];
		checkoutDelete(ids);
		setSelectedIds(new Set());
	};

	return (
		<Card
			className={cn(
				"bg-card-elevated border-card-elevated-border shadow-card-elevated border px-6 py-4 backdrop-blur-sm sm:px-8 sm:py-6 md:rounded-2xl",
				classNameCard
			)}
		>
			<FormProvider {...methods}>
				{editable && fields.length > 0 && (
					<div className="border-border mb-2 flex items-center gap-3 border-b pb-3">
						<Checkbox checked={allSelected} onCheckedChange={handleToggleAll} aria-label={t("selectAll")} />
						<span className="text-muted-foreground flex-1 text-sm">
							{someSelected ? `${t("selected")} (${selectedIds.size})` : t("selectAll")}
						</span>
						{someSelected && (
							<Button
								variant="ghost"
								size="sm"
								disabled={isDeleting}
								onClick={handleDeleteSelected}
								className="text-destructive hover:text-destructive gap-1.5 px-2"
							>
								<Trash2 size={14} />
								{t("deleteSelected")}
							</Button>
						)}
					</div>
				)}
				<ul data-testid="SummaryProductList">
					{fields?.map((line, index) => (
						<SummaryLineEdit
							line={line}
							key={line?.id}
							index={index}
							editable={editable}
							isBottomBorder={index === lines?.length - 1 ? false : true}
							isSelected={selectedIds.has(line._id)}
							onToggleSelect={handleToggle}
						>
							{editable ? (
								<SummaryItemMoneyEditableSection index={index} line={line} />
							) : (
								<SummaryItemMoneySection line={line as unknown as OrderLine} />
							)}
						</SummaryLineEdit>
					))}
				</ul>
				{isTabletOrBelow && <Summary {...rest} lines={lines} editable={editable} classNameCard="p-0" />}
			</FormProvider>
		</Card>
	);
};

export { SummaryListEdit };
