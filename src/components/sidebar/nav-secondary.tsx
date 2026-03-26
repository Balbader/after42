import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@/i18n/navigation"

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
	}[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild size="sm">
								<Link href={item.url}>
									<item.icon />
									<span className="font-(family-name:--font-dm-sans)">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
