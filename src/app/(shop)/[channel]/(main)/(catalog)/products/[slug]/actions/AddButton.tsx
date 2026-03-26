"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button, notify } from "@components/ui";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { addToCart } from "@/services/cart.service";

type AddButtonProps = {
	disabled?: boolean;
	channel: string;
	selectedVariantID: string;
	variants: NonNullable<ProductDetailsQuery["product"]>["variants"];
};

export function AddButton({ disabled, channel, selectedVariantID, variants }: AddButtonProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useMemo(() => new URLSearchParams(searchParams?.toString() ?? ""), [searchParams]);

	const [isLoadingAddItem, setLoadingAddItem] = useState<boolean>(false);
	const [isLoadingBuyNow, setLoadingBuyNow] = useState<boolean>(false);

	const handleSelectVariantID = useCallback(() => {
		let selectedVariant = selectedVariantID;
		if (!selectedVariant && variants?.length === 1 && variants[0]?.quantityAvailable) {
			selectedVariant = variants[0].id;
			params.set(`variant`, selectedVariant);
		}

		return selectedVariant;
	}, [selectedVariantID, variants, params]);

	const navigateCheckout = useCallback(
		(checkoutId?: string) => {
			return checkoutId && router.push(`/checkout?checkout=${checkoutId}`, undefined);
		},
		[router]
	);

	const handleAddItem = useCallback(
		async (isRedirect?: boolean) => {
			try {
				const checkoutId = await addToCart({
					channel,
					lines: [{ variantId: handleSelectVariantID(), quantity: 1 }]
				});

				if (isRedirect && checkoutId) {
					return navigateCheckout(checkoutId);
				}
				notify.info(
					<div className="flex flex-col gap-2">
						<p>Sản phẩm đã được thêm vào giỏ hàng</p>
						<Button
							variant={"default"}
							onClick={() => {
								notify.dismiss();
								navigateCheckout(checkoutId);
							}}
						>
							Đến thanh toán
						</Button>
					</div>
				);
				// toast({
				// 	description: "Sản phẩm đã được thêm vào giỏ hàng",
				// 	action: (
				// 		<Button variant={"default"} onClick={() => navigateCheckout(checkoutId)}>
				// 			Đến thanh toán
				// 		</Button>
				// 	)
				// });
			} catch (error) {
				console.log(error);
			} finally {
				if (isRedirect) return setLoadingBuyNow(false);
				setLoadingAddItem(false);
			}
		},
		[channel, handleSelectVariantID, navigateCheckout]
	);

	return (
		<div className="grid grid-cols-2 gap-3">
			<Button
				type="button"
				className="gap-1"
				aria-disabled={disabled}
				aria-busy={isLoadingAddItem}
				loading={isLoadingAddItem}
				disabled={disabled}
				onClick={async () => {
					setLoadingAddItem(true);
					void handleAddItem();
				}}
				size={"lg"}
			>
				<ShoppingCart />
				Thêm vào giỏ
			</Button>
			<Button
				type="button"
				aria-disabled={disabled}
				aria-busy={isLoadingBuyNow}
				loading={isLoadingBuyNow}
				disabled={disabled}
				onClick={async () => {
					setLoadingBuyNow(true);
					void handleAddItem(true);
				}}
				size={"lg"}
				variant={"feature"}
			>
				Mua ngay
			</Button>
		</div>
	);
}
