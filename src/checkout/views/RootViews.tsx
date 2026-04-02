import { Suspense } from "react";
import { Checkout } from "@/checkout/views/Checkout";

export const RootViews = () => {
	return (
		<Suspense fallback={<></>}>
			<Checkout />
		</Suspense>
	);
};
