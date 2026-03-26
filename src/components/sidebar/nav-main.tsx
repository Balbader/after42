'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
			icon?: LucideIcon;
		}[];
	}[];
}) {
	const t = useTranslations('sidebar');
	return (
		<SidebarGroup>
			<SidebarGroupLabel className='font-(family-name:--font-dm-sans)'>{t('platform')}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible key={item.title} asChild defaultOpen={item.isActive}>
						<SidebarMenuItem>
							<SidebarMenuButton asChild tooltip={item.title}>
								<Link href={item.url}>
									<item.icon />
									<span className='font-(family-name:--font-dm-sans)'>{item.title}</span>
								</Link>
							</SidebarMenuButton>
							{item.items?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuAction className='data-[state=open]:rotate-90'>
											<ChevronRight />
											<span className='sr-only'>{t('toggleSubmenu')}</span>
										</SidebarMenuAction>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<Link href={subItem.url}>
															{subItem.icon ? (
																<subItem.icon className="size-4 shrink-0" />
															) : null}
															<span className='font-(family-name:--font-dm-sans)'>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : null}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
