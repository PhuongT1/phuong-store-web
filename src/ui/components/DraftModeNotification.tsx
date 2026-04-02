import { draftMode } from "next/headers";
import Link from "next/link";

export const DraftModeNotification = async () => {
	if (!(await draftMode()).isEnabled) {
		return null;
	}

	return (
		<div className="fixed bottom-0 right-0 z-50 bg-destructive/10 px-8 py-2 text-destructive">
			You&apos;re in draft mode. Requests are not cached.{" "}
			<Link className="underline" href="/api/draft/disable">
				Disable.
			</Link>
		</div>
	);
};
