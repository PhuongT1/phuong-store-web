import { CLASS_BG_HEADER } from "@/constants";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@components/language/LanguageSwitcher";
import { Logo } from "@components/layouts/Logo";
import { ContainerLayout } from "../ContainerLayout";

const HeaderPublicLayout = () => {
	return (
		<header className={cn("sm:sticky sm:top-0 sm:z-20", CLASS_BG_HEADER)}>
			<ContainerLayout className="flex items-center justify-between py-2">
				<Logo />
				<LanguageSwitcher />
			</ContainerLayout>
		</header>
	);
};

export { HeaderPublicLayout };
