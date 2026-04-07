import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "@/checkout/components/Address";
import { AddressCreateForm } from "@/checkout/sections/address/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/address/AddressEditForm";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { type AddressFragment, type CountryCode } from "@/gql/graphql";
import { cn } from "@/lib/utils";

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

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="bg-card flex h-[80vh] flex-col gap-0 overflow-hidden rounded-(--radius) border-white/8 p-0 sm:max-w-2xl">
				{/* Sticky header */}
				<DialogHeader className="border-border shrink-0 border-b px-6 py-4 pr-14 text-left">
					<DialogTitle>{getTitle()}</DialogTitle>
				</DialogHeader>

				{/* Scrollable body — keyed on view triggers fade-in on each switch */}
				<div
					key={view === "edit" ? `edit-${editAddressId}` : view}
					className="animate-in fade-in min-h-0 flex-1 overflow-y-auto duration-150"
				>
					{view === "create" ? (
						<div className="px-6 py-4">
							<AddressCreateForm
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
						<div className="flex flex-col gap-3 p-4">
							{validAddresses.map((address) => {
								const isPending = address.id === pendingId;
								return (
									<div
										key={address.id}
										role="button"
										tabIndex={0}
										onClick={() => setPendingId(address.id)}
										onKeyDown={(e) => e.key === "Enter" && setPendingId(address.id)}
										className={cn(
											"relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 pr-12 text-left transition-all",
											isPending
												? "border-info/50 bg-info/5"
												: "border-border hover:border-border/60 hover:bg-accent/10"
										)}
									>
										<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
											{isPending ? (
												<div
													className="rounded-full"
													style={{
														width: 8,
														height: 8,
														background: "rgb(56, 189, 248)",
														boxShadow: "rgba(56, 189, 248, 0.4) 0px 0px 0px 4px"
													}}
												/>
											) : (
												<div className="border-border h-4 w-4 rounded-full border-2" />
											)}
										</div>
										<Address address={address} />
										<Button
											variant="ghost"
											size="icon"
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												setEditAddressId(address.id);
												setView("edit");
											}}
											className="text-muted-foreground hover:bg-muted absolute top-3 right-2 h-8 w-8"
										>
											<Pencil className="h-4 w-4" />
										</Button>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Sticky footer — only in list view */}
				{view === "list" && (
					<div className="border-border flex shrink-0 flex-col gap-2 border-t px-6 py-4">
						<Button type="button" className="w-full" disabled={!pendingId} onClick={handleConfirm}>
							{t("confirmAddress")}
						</Button>
						<Button
							variant="ghost"
							type="button"
							className="text-info hover:text-info hover:bg-info/10 w-full gap-2"
							onClick={() => setView("create")}
						>
							<Plus className="h-4 w-4" />
							{t("addNewAddress")}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

