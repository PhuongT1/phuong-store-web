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
import { Button, Checkbox, ImageItem } from "@components/ui";
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
	isSelected?: boolean;
	onToggleSelect?: (id: string) => void;
	compact?: boolean;
};

const SummaryLineEdit = React.memo(
	({
		line,
		children,
		index: indexLine,
		editable = true,
		isSelected = false,
		onToggleSelect,
		compact = false
	}: SummaryLineEditProps) => {
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
						compact
							? "bg-secondary/28 ring-border/38 flex flex-wrap items-start gap-2 rounded-2xl px-2.5 py-2.5 ring-1 transition-opacity duration-300 min-[1025px]:rounded-none min-[1025px]:bg-transparent min-[1025px]:px-0 min-[1025px]:py-4 min-[1025px]:ring-0 min-[1025px]:last:border-none"
							: "border-border/55 bg-card/58 flex flex-wrap items-start gap-2 rounded-xl border px-2 py-2 transition-opacity duration-300 dark:bg-card/52 sm:rounded-none sm:border-0 sm:border-b sm:bg-transparent sm:px-0 sm:py-4 sm:last:border-none",
						isUpdating && "pointer-events-none",
						isSelected &&
							(compact
								? "bg-info/10 ring-info/35 shadow-[0_14px_28px_-24px_rgba(56,189,248,0.44)]"
								: "border-info/45 bg-info/8 dark:bg-info/10")
					)}
					data-testid="SummaryItem"
					>
					{editable && onToggleSelect && (
						<Checkbox
							checked={isSelected}
							onCheckedChange={() => onToggleSelect(line._id)}
							className={cn("self-start", compact ? "mt-1 h-4 w-4 min-[1025px]:h-4 min-[1025px]:w-4" : "mt-1")}
						/>
					)}
					<div
						className={cn(
							"bg-product-image-bg border-border/68 flex aspect-square shrink-0 items-center justify-center overflow-hidden border ring-1 ring-black/[0.04] dark:ring-white/[0.08]",
							compact
								? "h-14 w-14 rounded-xl min-[1025px]:h-16 min-[1025px]:w-16 min-[1025px]:rounded-xl xl:h-[72px] xl:w-[72px]"
								: "h-12 w-12 rounded-lg sm:h-16 sm:w-16 sm:rounded-xl md:h-[72px] md:w-[72px]"
						)}
					>
						{productImage ? (
							<ImageItem
								src={productImage.url}
								alt={productImage.alt}
								className={cn(
									"object-contain drop-shadow-[0_8px_16px_rgba(15,23,42,0.18)] dark:brightness-[1.08] dark:contrast-[1.08] dark:drop-shadow-[0_14px_28px_rgba(0,0,0,0.62)]",
									compact ? "p-0.5 min-[1025px]:p-1" : "p-1"
								)}
							/>
						) : (
							<ImageIcon
								className={cn(
									"text-muted-foreground/50",
									compact ? "h-6 w-6 min-[1025px]:h-8 min-[1025px]:w-8" : "h-7 w-7 sm:h-8 sm:w-8"
								)}
							/>
						)}
					</div>
					<div className="relative flex flex-1 flex-col justify-between gap-1">
						<div className={cn("flex justify-between justify-items-start", compact ? "gap-1" : "gap-1.5")}>
							<div className="min-w-0 flex flex-col gap-y-0.5">
								<p
									className={cn(
										"truncate font-semibold",
										compact ? "text-[15px] leading-5 min-[1025px]:text-base" : "text-[15px] leading-5 sm:text-base"
									)}
								>
									{productName}
								</p>
								<div className={cn("flex flex-wrap", compact ? "gap-1 min-[1025px]:gap-2" : "gap-1.5 sm:gap-2")}>
								{editable &&
									line.variant?.assignedAttributes?.map((item: unknown, index: number) => {
										const { attribute } = item as AssignedSingleChoiceAttribute;
										const name =
											`summaryList.${indexLine}.variant.assignedAttributes.${index}.value.slug` as Path<SummaryLines>;
										const options = attribute.choices?.edges.map((choice: unknown) => ({
											...(choice as { node: Record<string, unknown> }).node
										}));

										return (
											<div key={index} className={cn("flex flex-col", compact ? "gap-0.5 min-[1025px]:gap-1" : "gap-0.5 sm:gap-1")}>
												<p
													className={cn(
														"text-muted-foreground font-medium",
														compact ? "text-[10px] min-[1025px]:text-xs" : "text-[11px] sm:text-xs"
													)}
												>
													{attribute.name}
												</p>
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
									<p className={cn("text-muted-foreground", compact ? "text-[11px] min-[1025px]:text-sm" : "text-xs sm:text-sm")}>
										{line.variant.name}
									</p>
								)}
							</div>
						</div>
						<div className={cn(isUpdating && "animate-pulse")}>{children}</div>
					</div>
				</div>
					{editable && (
						<div
							className={cn(
								"mt-1 flex w-full items-center",
								compact ? "justify-between gap-1.5 min-[1025px]:mt-0 min-[1025px]:justify-end min-[1025px]:gap-3" : "justify-between gap-2 sm:mt-0 sm:justify-end sm:gap-3"
							)}
						>
							<ConfirmDeleteDialog
								confirmButtonProps={{ onClick: () => checkoutDelete(line._id) }}
								triggerButtonClassName={cn(
									compact ? "h-8 w-8 min-[1025px]:h-9 min-[1025px]:w-9" : undefined
								)}
								triggerIconClassName={cn(compact ? "h-4 w-4 min-[1025px]:h-5 min-[1025px]:w-5" : undefined)}
							/>
							<div
								className={cn(
									"border-border/72 bg-card/98 dark:bg-muted/36 inline-flex items-center overflow-hidden rounded-lg border shadow-sm",
									compact ? "h-8 min-[1025px]:h-9" : "h-[34px] sm:h-9"
								)}
							>
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"border-border/68 text-foreground/85 hover:bg-accent/48 hover:text-foreground h-full rounded-none border-r shadow-none transition-colors",
										compact ? "w-[30px] min-[1025px]:w-9" : "w-8 sm:w-9"
									)}
									onClick={() => handleUpdateQuantity(quantity - 1)}
								>
									<Minus size={14} />
							</Button>
								<FormInput
								type="number"
								name={quantityPath}
									control={control}
									affixWrapperProps={{
										className: cn(
											"rounded-none border-0 bg-transparent shadow-none focus-within:ring-0",
											compact ? "h-8 px-0 min-[1025px]:h-9 min-[1025px]:px-1" : "h-[34px] px-0 sm:h-9 sm:px-1"
										)
									}}
									inputProps={{
										sizeVariant: "small",
										min: 1,
										max: 50,
										required: true,
										allowLeadingZeros: false,
										className: compact
											? "text-foreground w-[32px] text-center text-[11px] font-semibold min-[1025px]:w-[46px] min-[1025px]:text-sm"
											: "text-foreground w-[38px] text-center text-xs font-semibold sm:w-[46px] sm:text-sm",
										onValueCommit: handleChangeQuantity
									}}
								/>
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"border-border/68 text-foreground/85 hover:bg-accent/48 hover:text-foreground h-full rounded-none border-l shadow-none transition-colors",
										compact ? "w-[30px] min-[1025px]:w-9" : "w-8 sm:w-9"
									)}
									onClick={() => handleUpdateQuantity(quantity + 1)}
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
