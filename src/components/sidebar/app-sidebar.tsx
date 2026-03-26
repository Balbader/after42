'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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

import { SidebarModeToggle } from '@/components/dark-mode-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
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

export function AppSidebar({
	user,
	...props
}: { user: SidebarUser | null } & React.ComponentProps<typeof Sidebar>) {
	const t = useTranslations('sidebar');
	const avatar = user?.avatar ?? '/binary-code.png';

	const candidateData = React.useMemo(
		() => ({
			navMain: [
				{
					title: t('candidateHome'),
					url: '/dashboard',
					icon: LayoutDashboard,
					isActive: true,
					items: [
						{
							title: t('candidateDashboard'),
							url: '/dashboard',
						},
						{
							title: t('candidateMyProfile'),
							url: '/profile',
						},
					],
				},
				{
					title: t('candidateChallenges'),
					url: '/candidate/challenges',
					icon: ListChecks,
					isActive: true,
					items: [
						{
							title: t('candidateAll'),
							icon: Apple,
							url: '/candidate/challenges',
						},
						{
							title: t('candidateMyChallenges'),
							icon: MoonIcon,
							url: '/candidate/challenges',
						},
						{
							title: t('candidateMyOffers'),
							icon: ActivityIcon,
							url: '#',
						},
					],
				},
			],
			navSecondary: [
				{
					title: t('support'),
					url: '#',
					icon: LifeBuoy,
				},
				{
					title: t('feedback'),
					url: '#',
					icon: Send,
				},
			],
		}),
		[t],
	);

	const recruiterData = React.useMemo(
		() => ({
			navMain: [
				{
					title: t('recruiterHome'),
					url: '/dashboard',
					icon: Home,
					isActive: true,
					items: [
						{
							title: t('recruiterDashboard'),
							icon: LayoutDashboard,
							url: '/dashboard',
						},
						{
							title: t('recruiterCompanyProfile'),
							icon: Building,
							url: '/profile',
						},
						{
							title: t('recruiterMyProfile'),
							icon: UserIcon,
							url: '/profile',
						},
					],
				},
				{
					title: t('recruiterChallenges'),
					url: '/company/challenges',
					icon: Code,
					isActive: true,
					items: [
						{
							title: t('recruiterCreateChallenge'),
							icon: Stars,
							url: '/challenge/create',
						},
						{
							title: t('recruiterMyChallenges'),
							icon: FolderCode,
							url: '/company/challenges',
						},
						{
							title: t('recruiterCandidates'),
							icon: Users,
							url: '/challenge/candidates',
						},
					],
				},
			],
			navSecondary: [
				{
					title: t('support'),
					url: '#',
					icon: LifeBuoy,
				},
				{
					title: t('feedback'),
					url: '#',
					icon: Send,
				},
			],
		}),
		[t],
	);

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

			<SidebarFooter className='gap-2'>
				<SidebarMenu>
					<SidebarMenuItem className='flex items-center justify-center gap-2'>
						<LanguageSwitcher />
						<SidebarModeToggle />
					</SidebarMenuItem>
				</SidebarMenu>
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
