"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"

function themeMenuItems(setTheme: (theme: string) => void) {
	return (
		<>
			<DropdownMenuItem onClick={() => setTheme("light")}>
				Light
			</DropdownMenuItem>
			<DropdownMenuItem onClick={() => setTheme("dark")}>
				Dark
			</DropdownMenuItem>
			<DropdownMenuItem onClick={() => setTheme("system")}>
				System
			</DropdownMenuItem>
		</>
	)
}

export function ModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{themeMenuItems(setTheme)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

/** Theme switcher styled for the app sidebar (same options as ModeToggle). */
export function SidebarModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					tooltip="Theme"
					className="relative"
				>
					<span className="relative flex size-4 shrink-0 items-center justify-center">
						<Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
						<Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					</span>
					<span>Theme</span>
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="right" sideOffset={8}>
				{themeMenuItems(setTheme)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
