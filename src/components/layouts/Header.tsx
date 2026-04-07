import { Suspense } from "react";
import { CLASS_BG_HEADER } from "@/constants";
import { cn } from "@/lib/utils";
import { Nav } from "../nav/Nav";
import { ContainerLayout } from "./ContainerLayout";
import { HeaderSkeleton } from "./skeleton/HeaderSkeleton";

const Header = ({ channel }: { channel: string }) => {
	return (
		<header className={cn("border-border sticky top-0 z-40 w-full border-b", CLASS_BG_HEADER)}>
			<ContainerLayout className="py-0">
				<div className="flex flex-col justify-between py-0">
					<Suspense fallback={<HeaderSkeleton />}>
						<Nav channel={channel} />
					</Suspense>
				</div>
			</ContainerLayout>
		</header>
	);
};

export { Header };
