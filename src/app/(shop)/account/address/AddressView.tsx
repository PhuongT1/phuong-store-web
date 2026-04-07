"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog/Dialog";
import { type AddressInput, type CurrentUserQuery } from "@/gql/graphql";
import { createAddress, updateAddress, deleteAddress } from "./actions";
import { AddressForm } from "./AddressForm";

type User = NonNullable<CurrentUserQuery["me"]>;
type Address = User["addresses"][number];

export function AddressView({ user }: { user: User }) {
	const t = useTranslations("account");
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [addOpen, setAddOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<string | null>(null);

	const addresses = user.addresses;
	const defaultShippingId = user.defaultShippingAddress?.id;
	const defaultBillingId = user.defaultBillingAddress?.id;

	const handleCreate = async (input: AddressInput) => {
		setSubmitting(true);
		const result = await createAddress(input);
		setSubmitting(false);
		if (result.success) {
			setFeedback(t("addressSaveSuccess"));
			setAddOpen(false);
		} else {
			setFeedback(result.error ?? t("updateError"));
		}
	};

	const handleUpdate = async (input: AddressInput) => {
		if (!editingAddress) return;
		setSubmitting(true);
		const result = await updateAddress(editingAddress.id, input);
		setSubmitting(false);
		if (result.success) {
			setFeedback(t("addressSaveSuccess"));
			setEditingAddress(null);
		} else {
			setFeedback(result.error ?? t("updateError"));
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm(t("addressDeleteConfirm"))) return;
		setDeletingId(id);
		const result = await deleteAddress(id);
		setDeletingId(null);
		if (result.success) {
			setFeedback(t("addressDeleteSuccess"));
		} else {
			setFeedback(result.error ?? t("updateError"));
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{t("addressTitle")}</h1>
				<Dialog open={addOpen} onOpenChange={setAddOpen}>
					<DialogTrigger asChild>
						<Button size="sm">
							<Plus className="mr-1 h-4 w-4" />
							{t("addAddressTitle")}
						</Button>
					</DialogTrigger>
					<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
						<DialogHeader className="border-border border-b pb-4">
							<DialogTitle className="font-normal">{t("addAddressTitle")}</DialogTitle>
						</DialogHeader>
						<AddressForm
							onSubmit={handleCreate}
							onCancel={() => setAddOpen(false)}
							isSubmitting={submitting}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{feedback && <p className="text-info text-sm font-medium">{feedback}</p>}

			{addresses.length === 0 ? (
				<div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border px-4 py-20 text-center">
					<div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
						<MapPin className="text-muted-foreground h-8 w-8" />
					</div>
					<h3 className="text-foreground text-lg font-medium">{t("noAddresses")}</h3>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{addresses.map((address) => {
						const isDefaultShipping = address.id === defaultShippingId;
						const isDefaultBilling = address.id === defaultBillingId;
						const fullName = [address.firstName, address.lastName].filter(Boolean).join(" ");
						return (
							<div
								key={address.id}
								className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5"
							>
								<div className="flex items-start justify-between gap-2">
									<p className="text-foreground font-semibold">{fullName}</p>
									<div className="flex gap-1">
										{isDefaultShipping && (
											<span className="bg-info/10 text-info rounded px-2 py-0.5 text-xs font-medium">
												{t("defaultShipping")}
											</span>
										)}
										{isDefaultBilling && (
											<span className="bg-info/10 text-info rounded px-2 py-0.5 text-xs font-medium">
												{t("defaultBilling")}
											</span>
										)}
									</div>
								</div>
								<div className="text-muted-foreground space-y-0.5 text-sm">
									{address.streetAddress1 && <p>{address.streetAddress1}</p>}
									{address.city && (
										<p>
											{address.city}
											{address.postalCode ? `, ${address.postalCode}` : ""}
										</p>
									)}
									<p>{address.country.country}</p>
									{address.phone && (
										<p>
											{t("addressPhone")}: {address.phone}
										</p>
									)}
								</div>
								<div className="flex gap-2 pt-1">
									<Dialog
										open={editingAddress?.id === address.id}
										onOpenChange={(open) => setEditingAddress(open ? address : null)}
									>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Pencil className="mr-1 h-3.5 w-3.5" />
												{t("addressEdit")}
											</Button>
										</DialogTrigger>
										<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
											<DialogHeader className="border-border border-b pb-4">
												<DialogTitle className="font-normal">{t("editAddressTitle")}</DialogTitle>
											</DialogHeader>
											<AddressForm
												address={address}
												onSubmit={handleUpdate}
												onCancel={() => setEditingAddress(null)}
												isSubmitting={submitting}
											/>
										</DialogContent>
									</Dialog>
									<Button
										variant="outline"
										size="sm"
										className="text-destructive hover:bg-destructive/10"
										disabled={deletingId === address.id}
										onClick={() => handleDelete(address.id)}
									>
										<Trash2 className="mr-1 h-3.5 w-3.5" />
										{t("addressDelete")}
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
