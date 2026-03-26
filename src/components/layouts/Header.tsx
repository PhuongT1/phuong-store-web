import { Suspense } from "react";
import { Nav } from "../nav/Nav";
import { ContainerLayout } from "./ContainerLayout";
import { HeaderSkeleton } from "./skeleton/HeaderSkeleton";
import { cn } from "@/lib/utils";
import { CLASS_BG_HEADER } from "@/constants";

const Header = ({ channel }: { channel: string }) => {
	return (
		<header
			className={cn(
				"border-border/40 sticky top-0 z-20 w-full border-b shadow-[0_2px_10px_rgba(0,0,0,0.05)]",
				CLASS_BG_HEADER
			)}
		>
			<ContainerLayout className="py-0">
				<div className="flex flex-col justify-between py-1">
					<Suspense fallback={<HeaderSkeleton />}>
						<Nav channel={channel} />
					</Suspense>
				</div>
			</ContainerLayout>
		</header>
	);
};

export { Header };
