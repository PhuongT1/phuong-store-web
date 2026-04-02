"use client";

import { DropdownMenuElement, type MenuElement } from "@ui";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeMode = () => {
	const { theme, setTheme } = useTheme();

	const menu: MenuElement[] = [
		{
			icon: <Sun className="h-4 w-4" />,
			label: <>Light</>,
			onClick: () => setTheme("light"),
			active: theme === "light"
		},
		{
			icon: <Moon className="h-4 w-4" />,
			label: <>Dark</>,
			onClick: () => setTheme("dark"),
			active: theme === "dark"
		},
		{
			icon: <Monitor className="h-4 w-4" />,
			label: <>System</>,
			onClick: () => setTheme("system"),
			active: theme === "system"
		}
	];

	return (
		<DropdownMenuElement menus={menu}>
			<div className="relative flex h-6 w-6 items-center justify-center">
				<Sun
					className="h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
					strokeWidth={1.5}
				/>
				<Moon
					className="absolute h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
					strokeWidth={1.5}
				/>
			</div>
			<span className="sr-only">Toggle theme</span>
		</DropdownMenuElement>
	);
};

export { ThemeMode };
