import { ImageItem } from "@components/ui";
import { CheckoutItems } from "./CheckoutItems";
import { CheckoutSubmit } from "./CheckoutSubmit";
import { ButtonLink } from "./ButtonLink";
import { type Checkout as TCheckout } from "@/gql/graphql";
import * as Checkout from "@/action/checkout";
import { MainProductLayout } from "@/components/layouts";
import { getCheckoutIdCookie } from "@/action";

export default async function Page({}: { params: { channel: string } }) {
	const checkoutId = await getCheckoutIdCookie();
	const checkout = await Checkout.find(checkoutId);
	const isEmptyCart = !checkout || checkout.lines.length < 1;

	return (
		<MainProductLayout title={!isEmptyCart ? "Giỏ hàng" : undefined}>
			{isEmptyCart ? (
				<section className="text-center">
					<div className="flex justify-center">
						<ImageItem width={600} height={600} alt={"Empty"} src="/images/empty_cart.png" />
					</div>
					<p className="mb-4 text-sm text-neutral-500">Chưa có sản phẩm nào trong giỏ hàng</p>
					<ButtonLink href="/products" className="w-auto">
						Về trang chủ
					</ButtonLink>
				</section>
			) : (
				<form className="flex flex-col gap-4 md:flex-row ">
					<CheckoutItems checkout={checkout as TCheckout} checkoutId={checkoutId} />
					<CheckoutSubmit checkout={checkout as TCheckout} checkoutId={checkoutId} />
				</form>
			)}
		</MainProductLayout>
	);
}
