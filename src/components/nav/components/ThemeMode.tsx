"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuElement, type MenuElement } from "@ui";

const ThemeMode = () => {
	const { setTheme } = useTheme();

	const menu: MenuElement[] = [
		{
			label: <>Light</>,
			onClick: () => setTheme("light")
		},
		{
			label: <>Dark</>,
			onClick: () => setTheme("dark")
		},
		{
			label: <>System</>,
			onClick: () => setTheme("system")
		}
	];

	return (
		<DropdownMenuElement menus={menu}>
			<div className="relative flex h-5 w-5 items-center justify-center">
				<Sun className="h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Moon className="absolute h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			</div>
			<span className="sr-only">Toggle theme</span>
		</DropdownMenuElement>
	);
};

export { ThemeMode };
