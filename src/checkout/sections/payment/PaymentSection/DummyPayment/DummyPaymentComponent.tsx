import { type DummyPaymentComponentProps } from "./types";

export const DummyPaymentComponent = ({ config }: DummyPaymentComponentProps) => {
	return (
		<div className="text-muted-foreground text-sm">
			<p>Test payment method (Demo only)</p>
		</div>
	);
};
