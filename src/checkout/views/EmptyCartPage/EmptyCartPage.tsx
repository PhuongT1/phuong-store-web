import React from "react";
import { ErrorContentWrapper } from "@/checkout/components/ErrorContentWrapper";
import { Button, Typography } from "@components/ui";

export const EmptyCartPage = () => {
	return (
		<ErrorContentWrapper>
			<Typography variant="title" className="mb-0 text-xl">Your cart is empty</Typography>
			<p>Add anything to the cart to continue.</p>
			<Button variant="outline" asChild>
				<a href="/">Go back to store</a>
			</Button>
		</ErrorContentWrapper>
	);
};
