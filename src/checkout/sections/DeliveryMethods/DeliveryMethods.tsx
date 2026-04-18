import React from "react";
import { useDeliveryMethodsForm } from "@sections/DeliveryMethods/useDeliveryMethodsForm";
import { RadioGroup, RadioItem, RadioList, Typography, getFormattedMoney } from "@ui";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { useUser } from "@checkout/hooks/useUser";
import { type CommonSectionProps } from "@checkout/lib/globalTypes";
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Separator,
} from "@components/ui";
import { Scrollbar } from "@components/ui/Scrollbar";
import { useCheckout } from "@hooks/checkout";
import { DeliveryMethodsSkeleton } from "./DeliveryMethodsSkeleton";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
	const t = useTranslations("checkout");
	const { checkout } = useCheckout();
	const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
	const [pendingMethodId, setPendingMethodId] = React.useState<string | undefined>();
	const { isTabletOrBelow } = useDeviceSize();

	const { authenticated } = useUser();
	const { shippingMethods, shippingAddress } = checkout;
	const form = useDeliveryMethodsForm();
	const selectedMethodId = form.watch("selectedMethodId");

	// Reset pending whenever modal opens to sync with actual selection
	React.useEffect(() => {
		if (isOptionsOpen) {
			setPendingMethodId(selectedMethodId);
		}
	}, [isOptionsOpen, selectedMethodId]);

	const handleConfirm = () => {
		if ((pendingMethodId ?? "") !== (selectedMethodId ?? "")) {
			form.setValue("selectedMethodId", pendingMethodId ?? "", { shouldDirty: true });
		}
		setIsOptionsOpen(false);
	};

	const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	// Checkout chưa load xong → hiện skeleton thay vì null
	if (!checkout?.id) return <DeliveryMethodsSkeleton />;

	if (!checkout.isShippingRequired || collapsed) {
		return null;
	}

	const allShippingMethods = [...(shippingMethods ?? [])].sort((a, b) => {
		// Sort deterministically to prevent backend response from swapping positions
		if (a.price.amount !== b.price.amount) {
			return a.price.amount - b.price.amount;
		}
		return a.id.localeCompare(b.id);
	});

	const selectedMethod = allShippingMethods.find((method) => method.id === selectedMethodId);

	const previewMethods = (() => {
		if (allShippingMethods.length <= 2) return allShippingMethods;

		// Default original top 2
		const defaultTop2 = allShippingMethods.slice(0, 2);

		// If nothing is selected, or if the selected method is one of the original top 2:
		// Do NOT rearrange their order. Let them stay exactly where they were.
		if (!selectedMethod || defaultTop2.some((m) => m.id === selectedMethod.id)) {
			return defaultTop2;
		}

		// User picked an item from "View all options".
		// Rule: Push the newly selected active item to position 1, and keep the original cheapest as position 2.
		return [selectedMethod, defaultTop2[0]];
	})();

	// Extracted pure renderer so we can override the active state purely visually for the modal
	const renderMethodContent = ({
		id,
		name,
		price,
		minimumDeliveryDays: min,
		maximumDeliveryDays: max
	}: (typeof allShippingMethods)[number]) => (
		<div className="flex grow flex-col justify-center gap-1">
			<div className="flex flex-row items-center justify-between self-stretch">
				<p className="text-foreground text-[14px] font-semibold transition-colors min-[1025px]:text-[15px]">
					{name}
				</p>
				<p className="text-foreground text-[14px] font-semibold transition-colors min-[1025px]:text-[15px]">
					{getFormattedMoney(price)}
				</p>
			</div>
			{getSubtitle({ min, max }) && (
				<p className="text-muted-foreground text-[12px] font-normal transition-colors min-[1025px]:text-[13px]">
					{getSubtitle({ min, max })}
				</p>
			)}
		</div>
	);

	const renderMethodItem = (method: typeof allShippingMethods[0]) => (
		<RadioItem
			key={method.id}
			variant={"border"}
			divProps={{
				className:
					"rounded-xl border-0 bg-secondary/38 p-3 shadow-none [&_button]:mt-0 [&_button]:h-[18px] [&_button]:w-[18px] min-[1025px]:rounded-2xl min-[1025px]:border min-[1025px]:bg-card/96 min-[1025px]:p-4 min-[1025px]:shadow-sm"
			}}
			labelProps={{ className: "flex-1" }}
			optionProps={{
				label: renderMethodContent(method),
				value: method.id
			}}
		/>
	);

	const renderModalMethodItem = (method: typeof allShippingMethods[0]) => (
		<RadioItem
			key={method.id}
			variant={"border"}
			isActive={method.id === pendingMethodId}
			allowDeselect
			onToggle={() => setPendingMethodId(undefined)}
			divProps={{
				className:
					"rounded-xl border-0 bg-secondary/38 p-3 shadow-none [&_button]:mt-0 [&_button]:h-[18px] [&_button]:w-[18px] min-[1025px]:rounded-2xl min-[1025px]:border min-[1025px]:bg-card/96 min-[1025px]:p-4 min-[1025px]:shadow-sm"
			}}
			labelProps={{ className: "flex-1" }}
			optionProps={{
				label: renderMethodContent(method),
				value: method.id
			}}
		/>
	);

	const optionsContent = (
		<>
			<div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
				<Scrollbar className="-mr-2 h-full pr-2">
					<RadioGroup
						value={pendingMethodId ?? ""}
						onValueChange={(value) => setPendingMethodId(value || undefined)}
						className="grid-cols-1 gap-2.5"
					>
						{allShippingMethods.map(renderModalMethodItem)}
					</RadioGroup>
				</Scrollbar>
			</div>
			<div className="border-border/55 bg-card/96 shrink-0 border-t px-5 py-3 sm:px-6">
				<Button className="w-full" disabled={!pendingMethodId} onClick={handleConfirm}>
					{t("confirmShippingMethod")}
				</Button>
			</div>
		</>
	);

	return (
		<FormProvider {...form}>
			<Separator className="mt-2 min-[1025px]:mt-2" />
			<div className="py-4 min-[1025px]:py-4" data-testid="deliveryMethods">
				<div className="mb-3.5 flex items-center gap-3">
					<div className="bg-secondary/42 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
						<Package className="text-info h-5 w-5" strokeWidth={1.5} />
					</div>
					<Typography
						variant="section-label"
						className="mb-0! normal-case text-[15px] font-semibold tracking-tight sm:text-base"
					>
						{t("shippingMethod")}
					</Typography>
				</div>
				{authenticated && (!shippingAddress || !shippingAddress.country) ? (
					<p className="text-muted-foreground py-2 text-center text-sm">{t("shippingSelectAddress")}</p>
				) : !shippingMethods || shippingMethods.length === 0 ? (
					<div className="py-3">
						<p className="text-muted-foreground text-center text-sm">{t("noShippingMethods")}</p>
						<p className="text-muted-foreground mt-1 text-center text-xs">{t("fillAddress")}</p>
					</div>
				) : (
					<>
						<RadioList className="grid-cols-1 gap-2.5 sm:grid-cols-2" name="selectedMethodId">
							{previewMethods.map(renderMethodItem)}
						</RadioList>
						{allShippingMethods.length > 2 && (
							<div className="mt-3 flex justify-start">
								<Button
									variant="ghost"
									className="text-info hover:text-info hover:bg-info/8 h-9 gap-2 rounded-lg px-3"
									onClick={() => setIsOptionsOpen(true)}
								>
									{t("viewAllShippingOptions")}
								</Button>
							</div>
						)}
						{isTabletOrBelow ? (
							<Drawer open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
								<DrawerContent className="flex max-h-[85svh] w-full flex-col gap-0 rounded-t-2xl border-border/55 p-0">
									<DrawerHeader className="border-border/55 bg-card/96 shrink-0 border-b px-5 py-4 text-left">
										<DrawerTitle className="text-base font-semibold">{t("shippingMethod")}</DrawerTitle>
									</DrawerHeader>
									{optionsContent}
								</DrawerContent>
							</Drawer>
						) : (
							<Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
								<DialogContent className="flex max-h-[85vh] w-full max-w-full flex-col gap-0 overflow-hidden rounded-t-2xl rounded-b-none p-0 sm:max-w-xl sm:rounded-2xl">
									<DialogHeader className="border-border/55 bg-card/96 shrink-0 border-b px-5 py-4 pr-14 text-left sm:px-6">
										<DialogTitle className="text-base font-semibold">{t("shippingMethod")}</DialogTitle>
									</DialogHeader>
									{optionsContent}
								</DialogContent>
							</Dialog>
						)}
					</>
				)}
			</div>
		</FormProvider>
	);
};
