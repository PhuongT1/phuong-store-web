import { type FC } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Card } from "@components/ui";
import { type CheckoutLineForm, type CheckoutLineItem } from "../Cart.type";
import { SummaryLineEdit, type SummaryLines } from "./SummaryLineEdit";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { Summary } from "./Summary";
import { SummaryItemMoneySection } from "@/checkout/sections/Summary/SummaryItemMoneySection";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { type Checkout, type OrderLine } from "@/gql/graphql";

type SummaryListEditProps = {
	editable?: boolean;
	lines: CheckoutLineItem[];
	classNameCard?: string;
} & Checkout;

const SummaryListEdit: FC<SummaryListEditProps> = ({ editable = true, lines, ...rest }) => {
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
		<Card className="border-none bg-white px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:px-8 sm:py-6 md:rounded-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
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
