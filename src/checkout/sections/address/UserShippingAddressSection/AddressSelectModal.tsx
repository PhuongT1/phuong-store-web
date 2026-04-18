import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "@/checkout/components/Address";
import { AddressCreateForm } from "@/checkout/sections/address/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/address/AddressEditForm";
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
	RadioGroup,
	RadioItem
} from "@/components/ui";
import { type AddressFragment, type CountryCode } from "@/gql/graphql";
import { useDeviceSize } from "@/hooks/useDeviceSize";

type ModalView = "list" | "create" | "edit";

interface AddressSelectModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	addressList: AddressFragment[];
	selectedAddressId: string | undefined;
	availableCountries: CountryCode[];
	onSelectAddress: (id: string) => void;
	onAddressUpdate: (address: AddressFragment) => void;
	onAddressDelete: (id: string) => void;
	onAddressCreate: (address: AddressFragment) => void;
}

export const AddressSelectModal = ({
	open,
	onOpenChange,
	addressList,
	selectedAddressId,
	availableCountries,
	onSelectAddress,
	onAddressUpdate,
	onAddressDelete,
	onAddressCreate
}: AddressSelectModalProps) => {
	const t = useTranslations("checkout");
	const { isMobile } = useDeviceSize();
	const [pendingId, setPendingId] = useState<string | undefined>(selectedAddressId);
	const [view, setView] = useState<ModalView>("list");
	const [editAddressId, setEditAddressId] = useState<string | undefined>();

	useEffect(() => {
		if (open) {
			setPendingId(selectedAddressId);
			setView("list");
			setEditAddressId(undefined);
		}
	}, [open, selectedAddressId]);

	const editAddress = editAddressId ? addressList.find((a) => a.id === editAddressId) : undefined;

	const handleOpenChange = (val: boolean) => {
		onOpenChange(val);
	};

	const handleConfirm = () => {
		if (pendingId) onSelectAddress(pendingId);
		onOpenChange(false);
	};

	const getTitle = () => {
		if (view === "edit") return t("editAddress");
		if (view === "create") return t("addNewAddress");
		return t("selectShippingAddress");
	};

	const validAddresses = addressList.filter((addr) => {
		const hasName = !!(addr.firstName || addr.lastName)?.trim();
		const hasStreet = !!addr.streetAddress1?.trim();
		return hasName || hasStreet;
	});

	const content = (
		<>
			{isMobile ? (
				<DrawerHeader className="border-border/55 bg-card/96 shrink-0 border-b px-5 py-4 text-left">
					<DrawerTitle className="text-base font-semibold">{getTitle()}</DrawerTitle>
				</DrawerHeader>
			) : (
				<DialogHeader className="border-border/55 bg-card/96 shrink-0 border-b px-5 py-4 pr-14 text-left sm:px-6">
					<DialogTitle className="text-base font-semibold">{getTitle()}</DialogTitle>
				</DialogHeader>
			)}

			<div
				key={view === "edit" ? `edit-${editAddressId}` : view}
				className="animate-in fade-in slide-in-from-right-4 zoom-in-95 min-h-0 flex-1 overflow-y-auto duration-300 ease-out"
			>
				{view === "create" ? (
					<div className="px-6 py-4">
						<AddressCreateForm
							hideTitle
							availableCountries={availableCountries}
							onClose={() => setView("list")}
							onSuccess={(addr) => {
								onAddressCreate(addr);
								setView("list");
							}}
						/>
					</div>
				) : view === "edit" && editAddress ? (
					<div className="px-6 py-4">
						<AddressEditForm
							address={editAddress}
							availableCountries={availableCountries}
							onUpdate={(addr) => {
								onAddressUpdate(addr);
								setView("list");
								setEditAddressId(undefined);
							}}
							onDelete={(id) => {
								onAddressDelete(id);
								setView("list");
								setEditAddressId(undefined);
							}}
							onClose={() => {
								setView("list");
								setEditAddressId(undefined);
							}}
						/>
					</div>
				) : (
					<div className="p-4">
						<RadioGroup
							value={pendingId ?? ""}
							onValueChange={(value) => setPendingId(value || undefined)}
							className="grid-cols-1 gap-3"
						>
							{validAddresses.map((address) => (
								<RadioItem
									key={address.id}
									variant="border"
									isActive={address.id === pendingId}
									allowDeselect
									onToggle={() => setPendingId(undefined)}
									divProps={{
										className:
											"relative rounded-xl border border-border/40 bg-card/72 p-3 pr-11 shadow-none backdrop-blur-[2px] [&_button]:mt-0 [&_button]:h-[18px] [&_button]:w-[18px] min-[1025px]:rounded-2xl min-[1025px]:border-border/55 min-[1025px]:bg-card/96 min-[1025px]:p-4 min-[1025px]:pr-12 min-[1025px]:shadow-sm"
									}}
									labelProps={{ className: "flex-1" }}
									optionProps={{
										value: address.id,
										label: (
											<div className="relative w-full">
												<Address address={address} />
												<Button
													variant="ghost"
													size="icon"
													type="button"
													onClick={(event) => {
														event.preventDefault();
														event.stopPropagation();
														setEditAddressId(address.id);
														setView("edit");
													}}
													className="bg-background/64 text-muted-foreground hover:bg-background hover:text-foreground absolute top-0 right-0 h-8 w-8 rounded-full"
												>
													<Pencil className="h-4 w-4" />
												</Button>
											</div>
										)
									}}
								/>
							))}
						</RadioGroup>
					</div>
				)}
			</div>

			{view === "list" && (
				<div className="border-border/55 bg-card/96 flex shrink-0 flex-col gap-2 border-t px-6 py-4">
					<Button type="button" className="w-full" disabled={!pendingId} onClick={handleConfirm}>
						{t("confirmAddress")}
					</Button>
					<Button
						variant="ghost"
						type="button"
						className="text-info hover:text-info hover:bg-info/10 w-full gap-2 rounded-[calc(var(--radius)-4px)]"
						onClick={() => setView("create")}
					>
						<Plus className="h-4 w-4" />
						{t("addNewAddress")}
					</Button>
				</div>
			)}
		</>
	);

	return (
		isMobile ? (
			<Drawer open={open} onOpenChange={handleOpenChange}>
				<DrawerContent className="flex max-h-[85svh] w-full flex-col gap-0 overflow-hidden rounded-t-2xl border-border/55 p-0">
					{content}
				</DrawerContent>
			</Drawer>
		) : (
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="flex max-h-[85vh] w-full max-w-full flex-col gap-0 overflow-hidden rounded-t-2xl rounded-b-none p-0 sm:max-w-2xl sm:rounded-2xl">
					{content}
				</DialogContent>
			</Dialog>
		)
	);
};
