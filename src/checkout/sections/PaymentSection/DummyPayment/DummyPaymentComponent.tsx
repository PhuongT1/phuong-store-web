import { type DummyPaymentComponentProps } from "./types";

export const DummyPaymentComponent = ({ config }: DummyPaymentComponentProps) => {
	return (
		<div className="text-sm text-gray-600">
			<p>Test payment method (Demo only)</p>
		</div>
	);
};
