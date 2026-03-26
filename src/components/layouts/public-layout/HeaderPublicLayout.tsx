import { ImageItem } from "@components/ui";
import { LanguageSwitcher } from "@components/language/LanguageSwitcher";
import { ContainerLayout } from "../ContainerLayout";
import { cn } from "@/lib/utils";
import { CLASS_BG_HEADER } from "@/constants";

const HeaderPublicLayout = () => {
	return (
		<header className={cn("sm:sticky sm:top-0 sm:z-20", CLASS_BG_HEADER)}>
			<ContainerLayout className="flex items-center justify-between py-2">
				<div className="inline-flex justify-center">
					<ImageItem priority width={70} alt={"Login"} src="/images/logo.png" />
				</div>
				<LanguageSwitcher />
			</ContainerLayout>
		</header>
	);
};

export { HeaderPublicLayout };
