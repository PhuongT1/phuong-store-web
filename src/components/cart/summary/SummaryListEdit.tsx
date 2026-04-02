import { type FC } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { SummaryItemMoneySection } from "@/checkout/sections/order-summary/Summary/SummaryItemMoneySection";
import { type Checkout, type OrderLine } from "@/gql/graphql";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { cn } from "@/lib/utils";
import { Card } from "@components/ui";
import { type CheckoutLineForm, type CheckoutLineItem } from "../Cart.type";
import { Summary } from "./Summary";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { SummaryLineEdit, type SummaryLines } from "./SummaryLineEdit";

type SummaryListEditProps = {
	editable?: boolean;
	lines: CheckoutLineItem[];
	classNameCard?: string;
} & Checkout;

const SummaryListEdit: FC<SummaryListEditProps> = ({ editable = true, lines, classNameCard, ...rest }) => {
	const { isTabletOrBelow } = useDeviceSize();
	const methods = useForm<SummaryLines>({
		values: { summaryList: (lines?.map((item) => ({ ...item, _id: item.id })) ?? []) as CheckoutLineForm[] }
	});
	const { control } = methods;

	const { fields } = useFieldArray({
		control,
		name: "summaryList"
	});

	return (
		<Card className={cn("bg-card-elevated border-card-elevated-border shadow-card-elevated border px-6 py-4 backdrop-blur-sm sm:px-8 sm:py-6 md:rounded-2xl", classNameCard)}>
			<FormProvider {...methods}>
				<ul data-testid="SummaryProductList">
					{fields?.map((line, index) => (
						<SummaryLineEdit
							line={line}
							key={line?.id}
							index={index}
							editable={editable}
							isBottomBorder={index === lines?.length - 1 ? false : true}
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
