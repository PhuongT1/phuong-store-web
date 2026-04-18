import { type FC, useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { SummaryItemMoneySection } from "@/checkout/sections/order-summary/Summary/SummaryItemMoneySection";
import { type Checkout, type OrderLine } from "@/gql/graphql";
import { useCheckoutLines } from "@/hooks/checkout";
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
	compact?: boolean;
} & Checkout;

const SummaryListEdit: FC<SummaryListEditProps> = ({
	editable = true,
	lines,
	classNameCard,
	compact = false,
	...rest
}) => {
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
					compact
						? "bg-card-elevated border-0 px-0.5 py-0.5 shadow-none backdrop-blur-sm min-[1025px]:rounded-2xl min-[1025px]:border min-[1025px]:border-card-elevated-border min-[1025px]:px-8 min-[1025px]:py-6 min-[1025px]:shadow-card-elevated"
						: "bg-card-elevated border-card-elevated-border shadow-card-elevated border px-2 py-2 backdrop-blur-sm sm:px-8 sm:py-6 md:rounded-2xl",
					classNameCard
				)}
			>
				<FormProvider {...methods}>
					{editable && fields.length > 0 && (
						<div
							className={cn(
								"border-border flex items-center gap-2 border-b",
								compact ? "mb-2 pb-2 min-[1025px]:mb-2 min-[1025px]:gap-3 min-[1025px]:pb-3" : "mb-1.5 pb-1.5 sm:gap-3 sm:pb-3"
							)}
						>
							<Checkbox
								checked={allSelected}
								onCheckedChange={handleToggleAll}
								aria-label={t("selectAll")}
								className={cn(compact ? "h-4 w-4 min-[1025px]:h-4 min-[1025px]:w-4" : undefined)}
							/>
							<span
								className={cn(
									"text-muted-foreground flex-1 font-medium",
									compact ? "text-[15px] leading-5 min-[1025px]:text-sm min-[1025px]:leading-normal" : "text-xs sm:text-sm"
								)}
							>
								{someSelected ? `${t("selected")} (${selectedIds.size})` : t("selectAll")}
							</span>
						{someSelected && (
							<Button
								variant="ghost"
								size="sm"
								disabled={isDeleting}
								onClick={handleDeleteSelected}
								className={cn(
									"text-destructive hover:text-destructive gap-1",
									compact ? "h-7 px-1 text-[11px] min-[1025px]:h-9 min-[1025px]:px-2 min-[1025px]:text-xs" : "px-1.5 text-xs sm:gap-1.5 sm:px-2"
								)}
							>
								<Trash2 size={14} />
								{t("deleteSelected")}
							</Button>
							)}
						</div>
					)}
					<ul
						className={cn(
							compact ? "space-y-2.5 min-[1025px]:space-y-0" : "space-y-1 sm:space-y-0"
						)}
						data-testid="SummaryProductList"
					>
						{fields?.map((line, index) => (
						<SummaryLineEdit
							line={line}
							key={line?.id}
							index={index}
							editable={editable}
							compact={compact}
							isBottomBorder={index === lines?.length - 1 ? false : true}
							isSelected={selectedIds.has(line._id)}
							onToggleSelect={handleToggle}
						>
							{editable ? (
								<SummaryItemMoneyEditableSection index={index} line={line} compact={compact} />
							) : (
								<SummaryItemMoneySection line={line as unknown as OrderLine} />
							)}
						</SummaryLineEdit>
					))}
				</ul>
			</FormProvider>
		</Card>
	);
};

export { SummaryListEdit };
