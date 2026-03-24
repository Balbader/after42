'use client';

import * as React from 'react';
import {
	ActivityIcon,
	Apple,
	Building,
	Code,
	FolderCode,
	Home,
	LayoutDashboard,
	LifeBuoy,
	ListChecks,
	MoonIcon,
	Send,
	Stars,
	User as UserIcon,
	Users,
} from 'lucide-react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import after42Logo from '../../../public/binary-code.png';

/** Plain user shape passed from layout (User.toJSON()); no class instance. */
export type SidebarUser = {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar?: string;
};

const candidateData = {
	navMain: [
		{
			title: 'Home',
			url: '/dashboard',
			icon: LayoutDashboard,
			isActive: true,
			items: [
				{
					title: 'Dashboard',
					url: '/dashboard',
				},
				{
					title: 'My profile',
					url: '/profile',
				},
			],
		},
		{
			title: 'Challenges',
			url: '#',
			icon: ListChecks,
			isActive: true,
			items: [
				{
					title: 'All',
					icon: Apple,
					url: '#',
				},
				{
					title: 'My Challenges',
					icon: MoonIcon,
					url: '#',
				},
				{
					title: 'My Offers',
					icon: ActivityIcon,
					url: '#',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Support',
			url: '#',
			icon: LifeBuoy,
		},
		{
			title: 'Feedback',
			url: '#',
			icon: Send,
		},
	],
};

const recruiterData = {
	navMain: [
		{
			title: 'Home',
			url: '/dashboard',
			icon: Home,
			isActive: true,
			items: [
				{
					title: 'Dashboard',
					icon: LayoutDashboard,
					url: '/dashboard',
				},
				{
					title: 'Company Profile',
					icon: Building,
					url: '/profile',
				},
				{
					title: 'My Profile',
					icon: UserIcon,
					url: '/profile',
				},
			],
		},
		{
			title: 'Challenges',
			url: '/challenge',
			icon: Code,
			isActive: true,
			items: [
				{
					title: 'Create a Challenge',
					icon: Stars,
					url: '/challenge/create',
				},
				{
					title: 'My Challenges',
					icon: FolderCode,
					url: '/challenge/my-challenges',
				},
				{
					title: 'Candidates',
					icon: Users,
					url: '/challenge/candidates',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Support',
			url: '#',
			icon: LifeBuoy,
		},
		{
			title: 'Feedback',
			url: '#',
			icon: Send,
		},
	],
};
export function AppSidebar({
	user,
	...props
}: { user: SidebarUser | null } & React.ComponentProps<typeof Sidebar>) {
	const avatar = user?.avatar ?? '/binary-code.png';
	return (
		<Sidebar variant='inset' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className='flex items-center justify-center'>
						<Image src={after42Logo} alt='After42' width={50} height={50} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					items={
						user?.role === 'candidate'
							? candidateData.navMain
							: user?.role === 'recruiter'
								? recruiterData.navMain
								: []
					}
				/>
				<NavSecondary
					items={
						user?.role === 'candidate'
							? candidateData.navSecondary
							: recruiterData.navSecondary
					}
					className='mt-auto'
				/>
			</SidebarContent>

			<SidebarFooter>
				<NavUser
					user={{
						name: user?.name ?? '',
						email: user?.email ?? '',
						avatar,
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
