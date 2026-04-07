"use client";

import React, { type ReactNode } from "react";
import { ImageIcon, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FieldArrayWithId, type Path, useFormContext } from "react-hook-form";
import { FormCombobox } from "@/components/ui/combobox/FormCombobox";
import { FormInput } from "@/components/ui/input/FormInput";
import { type AssignedSingleChoiceAttribute, type OrderLine } from "@/gql/graphql";
import { useCheckoutLines } from "@/hooks/checkout";
import { cn } from "@/lib/utils";
import { type Option } from "@/types";
import { Button, ImageItem } from "@components/ui";
import { type CheckoutLineForm } from "../Cart.type";
import { ConfirmDeleteDialog } from "../line-item/ConfirmDialog";
import { getThumbnailFromLine } from "../utils";

export type SummaryLines = {
	summaryList: CheckoutLineForm[];
};

export type SummaryLineEditProps = {
	line: FieldArrayWithId<SummaryLines, "summaryList", "id">;
	children: ReactNode;
	isBottomBorder?: boolean;
	index: number;
	editable?: boolean;
};

const SummaryLineEdit = React.memo(
	({ line, children, index: indexLine, editable = true }: SummaryLineEditProps) => {
		const t = useTranslations("cart");
		const { control, watch, setError, setValue } = useFormContext<SummaryLines>();

		const {
			addCart: { checkoutAdd },
			updateCart: { checkoutUpdate, isUpdating },
			deleteCart: { checkoutDelete }
		} = useCheckoutLines();

		const quantityPath: Path<SummaryLines> = `summaryList.${indexLine}.quantity`;
		const summaryLine = watch(`summaryList.${indexLine}`);
		const quantity = watch(quantityPath);

		const handleChangeQuantity = <T,>(quantity?: T) => {
			if (Number(quantity) === 0) return;
			checkoutUpdate([
				{
					quantity: Number(quantity),
					variantId: line.variant?.id
				}
			]);
		};

		const getSummaryLineProps = () => {
			const orderLine = line as unknown as OrderLine;
			return {
				variantName: line.variant?.name || orderLine.variantName,
				productName: line.variant?.product?.name || orderLine.productName,
				productImage: getThumbnailFromLine({ line })
			};
		};

		const { productName, productImage } = getSummaryLineProps();

		const findMatchedVariant = () => {
			if (!summaryLine.variant?.assignedAttributes) return null;
			const values = summaryLine.variant.assignedAttributes.map((item: unknown) => {
				const attribute = item as AssignedSingleChoiceAttribute;
				return attribute.value?.slug;
			});

			return line.variant?.product?.productVariants?.edges.find((variant: unknown) => {
				const variantNode = variant as {
					node: { assignedAttributes: unknown[]; id: string; quantityAvailable: number };
				};
				return variantNode.node.assignedAttributes.every((attr: unknown) => {
					const attributes = attr as AssignedSingleChoiceAttribute;
					if (values.includes(attributes?.value?.slug)) {
						return true;
					}
					return false;
				});
			});
		};

		const handleChange = (name: Path<SummaryLines>) => {
			const variantSelected = findMatchedVariant();

			if (!(Number(variantSelected?.node.quantityAvailable) > 0)) {
				return setError(name, { message: t("outOfStock") });
			}
			if (variantSelected && variantSelected?.node.id) {
				checkoutAdd([
					{
						quantity: summaryLine.quantity,
						variantId: variantSelected?.node.id
					}
				]);
				checkoutDelete(summaryLine._id);
			}
		};

		const handleUpdateQuantity = (quantity: number) => {
			setValue(quantityPath, quantity);
			handleChangeQuantity(quantity);
		};

		return (
			<li
				key={line.id}
				className={cn(
					"border-border flex flex-wrap items-center gap-2 border-b py-4 transition-opacity duration-300 last:border-none",
					isUpdating && "pointer-events-none"
				)}
				data-testid="SummaryItem"
			>
				<div className="bg-popover border-border aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border md:h-[72px] md:w-[72px]">
					{productImage ? (
						<ImageItem src={productImage.url} alt={productImage.alt} />
					) : (
						<ImageIcon className="text-muted-foreground h-8 w-8" />
					)}
				</div>
				<div className="relative flex flex-1 flex-col justify-between gap-2">
					<div className="flex justify-between justify-items-start gap-1">
						<div className="flex flex-col gap-y-1">
							<p className="font-medium">{productName}</p>
							<div className="flex gap-2">
								{editable &&
									line.variant?.assignedAttributes?.map((item: unknown, index: number) => {
										const { attribute } = item as AssignedSingleChoiceAttribute;
										const name =
											`summaryList.${indexLine}.variant.assignedAttributes.${index}.value.slug` as Path<SummaryLines>;
										const options = attribute.choices?.edges.map((choice: unknown) => ({
											...(choice as { node: Record<string, unknown> }).node
										}));

										return (
											<div key={index} className="flex flex-col gap-1">
												<p className="text-muted-foreground text-xs font-medium">{attribute.name}</p>
												<FormCombobox
													control={control}
													name={name}
													fieldNames={{ label: "name", value: "slug" }}
													options={options as Option[]}
													commandItemProps={{
														onSelect: () => handleChange(name)
													}}
													optionRender={(option: unknown, optIndex: number) => {
														const optName = (option as { name: string }).name;
														if (
															attribute.slug !== "mau-sac" ||
															!line.variant?.product?.productVariants?.edges[optIndex]
														) {
															return optName;
														}
														return (
															<div className="flex items-center gap-2">
																<ImageItem
																	priority
																	size={30}
																	src={
																		line.variant?.product?.productVariants?.edges[optIndex]?.node.media?.[0]
																			?.url ?? ""
																	}
																/>
																{optName}
															</div>
														);
													}}
												/>
											</div>
										);
									})}
								{!editable && line.variant?.name && (
									<p className="text-muted-foreground text-sm">{line.variant.name}</p>
								)}
							</div>
						</div>
						<div className={cn(isUpdating && "animate-pulse")}>{children}</div>
					</div>
				</div>
				{editable && (
					<div className="flex w-full items-center justify-end gap-3">
						<ConfirmDeleteDialog confirmButtonProps={{ onClick: () => checkoutDelete(line._id) }} />
						<div className="bg-popover border-border inline-flex h-8 items-center overflow-hidden rounded-lg border">
							<Button
								variant="ghost"
								size="icon"
								className="border-border text-muted-foreground hover:text-foreground h-full w-8 rounded-none border-r shadow-none"
								onClick={() => {
									handleUpdateQuantity(quantity - 1);
								}}
							>
								<Minus size={14} />
							</Button>
							<FormInput
								type="number"
								name={quantityPath}
								control={control}
								affixWrapperProps={{
									className: "rounded-none border-0 focus-within:ring-0 px-1 h-8 bg-popover"
								}}
								inputProps={{
									sizeVariant: "xsmall",
									min: 1,
									max: 50,
									required: true,
									allowLeadingZeros: false,
									className: "w-[36px] text-center",
									onValueCommit: handleChangeQuantity
								}}
							/>
							<Button
								variant="ghost"
								size="icon"
								className="border-border text-muted-foreground hover:text-foreground h-full w-8 rounded-none border-l shadow-none"
								onClick={() => {
									handleUpdateQuantity(quantity + 1);
								}}
							>
								<Plus size={14} />
							</Button>
						</div>
					</div>
				)}
			</li>
		);
	}
);
SummaryLineEdit.displayName = "SummaryLineEdit";

export { SummaryLineEdit };
