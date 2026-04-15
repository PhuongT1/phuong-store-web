"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import { Ticket, TicketPercent, ChevronRight, Check, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { type Classes } from "@/checkout/lib/globalTypes";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Typography } from "@/components/ui";
import { FormInput } from "@/components/ui/input/FormInput";
import { Scrollbar } from "@/components/ui/Scrollbar";
import { notify } from "@/components/ui/Sonner";
import { CheckoutAddPromoCodeDocument, CheckoutRemovePromoCodeDocument } from "@/gql/graphql";
import { clientFetchGraphQL } from "@/lib/api/clientGraphQLWithRetry";
import { cn } from "@/lib/utils";
import { useCheckout } from "@hooks/checkout";

interface PromoCodeFormData {
	promoCode: string;
}

type VoucherListItem = {
	id: string;
	code: string;
	name: string;
	discountValue: number | null;
	discountValueType: "FIXED" | "PERCENTAGE";
	minSpent: { amount: number; currency: string } | null;
	type: string;
};

const formatMoney = (amount: number, currency: string, locale: string) =>
	new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: amount % 1 === 0 ? 0 : 2
	}).format(amount);

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
	const t = useTranslations("checkout");
	const safeT = (key: Parameters<typeof t>[0], fallback: string) => {
		try {
			return t(key);
		} catch {
			return fallback;
		}
	};
	const locale = useLocale();
	const { checkout, mutate } = useCheckout();
	const [isOpen, setIsOpen] = useState(false);
	const [vouchers, setVouchers] = useState<VoucherListItem[]>([]);
	const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const form = useForm<PromoCodeFormData>({ defaultValues: { promoCode: "" } });
	const { control, handleSubmit, reset, watch, setValue } = form;
	const promoCode = watch("promoCode");
	// appliedCode is always what's actually applied to the order (from server)
	const appliedCode = checkout.voucherCode?.trim().toUpperCase() ?? null;
	const activeVoucherCode = (promoCode || appliedCode || "").trim().toUpperCase();

	const onSubmit = handleSubmit(async ({ promoCode: code }) => {
		const data = await clientFetchGraphQL(CheckoutAddPromoCodeDocument, {
			variables: { promoCode: code, checkoutId: checkout.id }
		});
		const apiErrors = data.checkoutAddPromoCode?.errors;
		if (apiErrors?.length) {
			notify.error(apiErrors[0]?.message ?? t("promoInvalid"));
			return;
		}
		notify.success(t("promoSuccess"));
		void mutate();
		setIsOpen(false);
		reset();
	});

	/** Remove the currently applied voucher from the order */
	const onRemoveVoucher = async () => {
		if (!appliedCode) return;
		setIsRemoving(true);
		try {
			const data = await clientFetchGraphQL(CheckoutRemovePromoCodeDocument, {
				variables: { checkoutId: checkout.id, promoCode: appliedCode }
			});
			const errors = data?.checkoutRemovePromoCode?.errors;
			if (errors?.length) {
				notify.error(errors[0]?.message ?? "Failed to remove voucher");
				return;
			}
			notify.success(safeT("promoRemoved", "Voucher removed"));
			reset();
			void mutate();
		} finally {
			setIsRemoving(false);
		}
	};

	useEffect(() => {
		if (!isOpen) return;

		let cancelled = false;
		setIsLoadingVouchers(true);

		void fetch(`/api/vouchers?channel=${checkout.channel.slug}&locale=${locale}`, { cache: "no-store" })
			.then(async (response) => {
				const payload = (await response.json()) as { results?: VoucherListItem[] };
				if (!cancelled) {
					setVouchers(payload.results ?? []);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setVouchers([]);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoadingVouchers(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [checkout.channel.slug, isOpen, locale]);

	const voucherItems = useMemo(
		() =>
			vouchers.map((voucher) => {
				const isPercentage = voucher.discountValueType === "PERCENTAGE";
				const title =
					voucher.name ||
					(isPercentage
						? t("voucherOffPercent", { value: voucher.discountValue ?? 0 })
						: t("voucherOffAmount", {
								value: formatMoney(
									voucher.discountValue ?? 0,
									voucher.minSpent?.currency ?? checkout.totalPrice?.gross.currency ?? "USD",
									locale
								)
							}));
				const description =
					voucher.type === "SHIPPING"
						? t("voucherShipping")
						: voucher.minSpent
							? t("voucherMinSpent", {
									value: formatMoney(voucher.minSpent.amount, voucher.minSpent.currency, locale)
								})
							: isPercentage
								? t("voucherPercentDescription", { value: voucher.discountValue ?? 0 })
								: t("voucherReady");

				return { ...voucher, title, description };
			}),
		[checkout.totalPrice?.gross.currency, locale, t, vouchers]
	);

	const toggleVoucherSelection = (code: string) => {
		const normalized = code.trim().toUpperCase();
		const isActive = activeVoucherCode === normalized;

		if (isActive) {
			// If this voucher is already applied on server, remove it directly.
			if (appliedCode === normalized) {
				void onRemoveVoucher();
				return;
			}
			// If it's only selected locally in the input, clear local selection.
			setValue("promoCode", "", { shouldDirty: true, shouldTouch: true });
			return;
		}

		setValue("promoCode", code, { shouldDirty: true, shouldTouch: true });
	};

	const selectVoucher = (code: string) => {
		setValue("promoCode", code, { shouldDirty: true, shouldTouch: true });
		void onSubmit();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<div
				role="button"
				tabIndex={0}
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				className={cn(
					"border-border sm:bg-card group flex w-full items-center justify-between border-0 bg-transparent py-3 transition-all active:scale-[0.99] sm:my-3 sm:rounded-xl sm:border sm:px-4 sm:py-3 sm:shadow-sm",
					appliedCode && "sm:border-info/30 sm:bg-info/5",
					className
				)}
				onClick={() => setIsOpen(true)}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						setIsOpen(true);
					}
				}}
			>
				<div className="flex items-center gap-2.5">
					<Ticket className={cn("h-4.5 w-4.5 sm:h-4 sm:w-4", appliedCode ? "text-info" : "text-muted-foreground")} strokeWidth={1.5} />
					<div className="flex flex-col items-start">
						<Typography variant="section-label" className="mb-0! normal-case text-base sm:text-[15px]">
							{t("voucherDrawerTitle")}
						</Typography>
						{appliedCode && (
							<span className="text-info mt-0.5 text-[11px] font-bold tracking-[0.06em]">
								{appliedCode}
							</span>
						)}
					</div>
				</div>
				<div className="text-muted-foreground flex items-center gap-1">
					{appliedCode ? (
						<button
							type="button"
							disabled={isRemoving}
							onClick={(e) => { e.stopPropagation(); void onRemoveVoucher(); }}
							className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50"
						>
							<X className="h-3.5 w-3.5" />
							{isRemoving ? "..." : safeT("remove", "Xóa")}
						</button>
					) : (
						<>
							<span className="text-sm font-medium sm:text-[13px]">{t("enterPromoCode")}</span>
							<ChevronRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
						</>
					)}
				</div>
			</div>

			<DialogContent className="bg-card flex max-h-[85vh] w-full max-w-full translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-t-2xl border-white/8 p-0 top-auto right-auto bottom-0 left-1/2 sm:top-[50%] sm:bottom-auto sm:max-h-[min(78vh,560px)] sm:w-[min(560px,calc(100vw-2rem))] sm:max-w-[min(560px,calc(100vw-2rem))] sm:translate-y-[-50%] sm:rounded-2xl">
				<DialogHeader className="border-border shrink-0 border-b px-5 py-4 pr-14 text-left sm:px-6 sm:pr-16">
					<DialogTitle>{t("voucherDrawerTitle")}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:gap-3 sm:p-5">
					<FormProvider {...form}>
						<form onSubmit={onSubmit} className="flex flex-col gap-2">
							<Typography className="text-sm font-medium">{t("enterPromoCode")}</Typography>
							<div className="flex w-full items-center gap-2">
								<div className="flex-1">
									<FormInput
										control={control}
										name="promoCode"
										inputProps={{ placeholder: t("enterPromoCode") }}
									/>
								</div>
								<Button
									aria-label={t("apply")}
									variant="info"
									type="submit"
									disabled={!promoCode?.trim()}
									className="h-10 px-6 text-sm font-medium"
								>
									{t("apply")}
								</Button>
							</div>
						</form>
					</FormProvider>

					<div className="mt-1 flex-1 overflow-hidden sm:mt-0">
						<Typography className="mb-3 text-sm font-medium">{t("availableVouchers")}</Typography>
						<Scrollbar className="flex h-full max-h-[268px] flex-col gap-3 border-none pr-3">
							<div className="flex flex-col gap-2.5 pb-6 sm:gap-2">
								{isLoadingVouchers &&
									Array.from({ length: 3 }).map((_, index) => (
										<div
											key={index}
											className="rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-white p-4 dark:border-rose-900/40 dark:from-rose-950/30 dark:via-card dark:to-card"
										>
											<div className="flex items-start gap-3">
												<Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
												<div className="flex-1 space-y-2">
													<div className="flex gap-2">
														<Skeleton className="h-5 w-14 rounded-full" />
														<Skeleton className="h-5 w-20 rounded-full" />
													</div>
													<Skeleton className="h-4 w-32 rounded" />
													<Skeleton className="h-3 w-44 rounded" />
													<Skeleton className="h-3 w-20 rounded" />
												</div>
												<Skeleton className="h-8 w-20 rounded-full" />
											</div>
										</div>
									))}

								{voucherItems.map((voucher) => {
									const normalizedVoucherCode = voucher.code.toUpperCase();
									const isActive = activeVoucherCode === normalizedVoucherCode;
									const isAppliedVoucher = appliedCode === normalizedVoucherCode;

									return (
										<div
											key={voucher.id}
											role="button"
											tabIndex={0}
											aria-pressed={isActive}
											onClick={() => toggleVoucherSelection(voucher.code)}
											onKeyDown={(event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.preventDefault();
													toggleVoucherSelection(voucher.code);
												}
											}}
											className={cn(
												"relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-all",
												isActive
													? "border-rose-300 bg-gradient-to-r from-rose-50 via-white to-white shadow-[0_12px_24px_rgba(244,63,94,0.10)] dark:border-rose-800/70 dark:from-rose-950/35 dark:via-card dark:to-card"
													: "border-rose-200/80 bg-gradient-to-r from-rose-50/90 via-white to-white hover:border-rose-300 hover:shadow-[0_8px_20px_rgba(244,63,94,0.08)] dark:border-rose-900/40 dark:from-rose-950/25 dark:via-card dark:to-card dark:hover:border-rose-800/70"
											)}
										>
											<div className="border-rose-200 bg-rose-50/90 relative flex h-16 w-16 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border dark:border-rose-900/60 dark:bg-rose-950/30">
												<div className="bg-rose-100 text-rose-500 dark:bg-rose-900/50 dark:text-rose-300 flex h-9 w-9 items-center justify-center rounded-xl">
													<TicketPercent className="h-4.5 w-4.5" strokeWidth={1.9} />
												</div>
												<span className="mt-1 text-[10px] font-semibold text-rose-400 dark:text-rose-300">
													Deal24
												</span>
												{isActive && (
													<div className="bg-info ring-info/30 absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full ring-[4px]" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<div className="mb-1 flex flex-wrap items-center gap-1.5">
													<span className="bg-rose-100 text-rose-500 dark:bg-rose-900/50 dark:text-rose-300 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] uppercase">
														{voucher.type === "SHIPPING" ? "Ship" : "Voucher"}
													</span>
													{voucher.discountValueType === "PERCENTAGE" && (
														<span className="bg-rose-500 text-white inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] uppercase">
															Extra
														</span>
													)}
												</div>
												<Typography className="text-rose-500 dark:text-rose-300 text-sm font-bold sm:text-[15px]">
													{voucher.title}
												</Typography>
												<Typography className="text-foreground/78 dark:text-foreground/72 mt-0.5 text-xs leading-relaxed">
													{voucher.description}
												</Typography>
												<Typography className="text-muted-foreground mt-1.5 text-[11px] font-semibold uppercase">
													{voucher.code}
												</Typography>
											</div>
											<Button
												variant={isActive ? "destructive-outline" : "info"}
												size="sm"
												className={cn(
													"h-9 shrink-0 rounded-xl px-4 text-xs font-bold shadow-sm transition-all",
													isActive && "border-rose-400/60 text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
												)}
												onClick={(event) => {
													event.stopPropagation();
													if (isActive) {
														if (isAppliedVoucher) {
															void onRemoveVoucher();
														} else {
															setValue("promoCode", "", { shouldDirty: true, shouldTouch: true });
														}
													} else {
														selectVoucher(voucher.code);
													}
												}}
												disabled={isRemoving}
											>
												{isActive ? (
													<>
														<X className="mr-1 h-3.5 w-3.5" />
														{isRemoving
															? "..."
															: isAppliedVoucher
																? safeT("remove", "Gỡ")
																: safeT("clearSelection", "Bỏ chọn")}
													</>
												) : (
													<>
														<Check className="mr-1 h-3.5 w-3.5" />
														{t("useVoucher")}
													</>
												)}
											</Button>
										</div>
									);
								})}

								{!isLoadingVouchers && voucherItems.length === 0 && (
									<div className="border-border rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
										{t("noAvailableVouchers")}
									</div>
								)}
							</div>
						</Scrollbar>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
