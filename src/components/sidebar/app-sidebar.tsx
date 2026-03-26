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
import { Link } from '@/i18n/navigation';

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
	const tNav = useTranslations('navigation');
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
							url: '/company/candidates',
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
					<SidebarMenuItem className='px-2'>
						<Link
							href='/dashboard'
							className='block rounded-sm py-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--a42-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--a42-surface)'
						>
							<span className='font-(family-name:--font-fraunces) text-xl font-medium tracking-[-0.02em] text-(--a42-text)'>
								{tNav('brandAfter')}
								<span className='text-(--a42-accent)'>
									{tNav('brandSuffix')}
								</span>
							</span>
						</Link>
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
