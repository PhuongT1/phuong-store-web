import { getCheckoutIdCookie } from "@/action";
import * as Checkout from "@/action/checkout";
import { CartNavItemClient } from "./CartNavItemClient";

export const CartNavItem = async () => {
	const checkoutId = await getCheckoutIdCookie();
	let checkout: Awaited<ReturnType<typeof Checkout.find>> | undefined;
	try {
		checkout = checkoutId ? await Checkout.find(checkoutId) : null;
	} catch {
		checkout = undefined;
	}
	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return <CartNavItemClient lineCount={lineCount} checkoutId={checkoutId} />;
};
