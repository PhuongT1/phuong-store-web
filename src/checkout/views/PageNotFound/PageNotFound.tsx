import { AlertTriangle } from "lucide-react";
import { type FallbackProps } from "react-error-boundary";
import { ErrorContentWrapper } from "@/checkout/components/ErrorContentWrapper";
import { Button } from "@/components/ui/Button";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	if (error) console.error(error);

	const goBack = () => history.back();

	return (
		<ErrorContentWrapper>
			<AlertTriangle className="mb-4 h-12 w-12 text-warning" />
			<p>We couldn&apos;t fetch information about your checkout. Go back to the store and try again.</p>
			<Button aria-label="Go back to store" onClick={goBack} variant="outline">Go back to store</Button>
		</ErrorContentWrapper>
	);
};
