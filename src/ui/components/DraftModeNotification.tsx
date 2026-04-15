import { draftMode } from "next/headers";
import Link from "next/link";

export const DraftModeNotification = async () => {
	if (!(await draftMode()).isEnabled) {
		return null;
	}

	return (
		<div className="fixed right-3 bottom-3 left-3 z-50 sm:right-4 sm:bottom-4 sm:left-auto">
			<div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-sm sm:px-4">
				<span className="whitespace-nowrap sm:hidden">Draft mode on</span>
				<span className="hidden whitespace-nowrap sm:inline">You&apos;re in draft mode. Requests are not cached.</span>
				<Link className="shrink-0 whitespace-nowrap underline underline-offset-2" href="/api/draft/disable">
					Disable
				</Link>
			</div>
		</div>
	);
};
