'use client';

import {
	ChevronsUpDown,
	LogOut,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { signOutAction } from '@/app/actions/auth';
import { useRouter } from '@/i18n/navigation';

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const t = useTranslations('sidebar');
	const tAuth = useTranslations('authSignOut');
	const router = useRouter();

	const initials = getInitials(user.name || '?');

	const handleSignOut = async () => {
		try {
			await toast
				.promise(
					(async () => {
						const result = await signOutAction();
						if (!result.success) {
							throw new Error(tAuth('toastError'));
						}
					})(),
					{
						loading: tAuth('toastSigningOut'),
						success: tAuth('toastSuccess'),
						error: (err) =>
							err instanceof Error ? err.message : tAuth('toastError'),
					},
				)
				.unwrap();
			router.push('/');
			router.refresh();
		} catch {
			// Error toast already shown by toast.promise
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className='rounded-lg font-(family-name:--font-dm-sans) text-xs'>
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight font-(family-name:--font-dm-sans)'>
								<span className='truncate font-medium'>{user.name}</span>
								<span className='truncate text-xs text-sidebar-foreground/60'>{user.email}</span>
							</div>
							<ChevronsUpDown className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg font-(family-name:--font-dm-sans)'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className='rounded-lg text-xs'>
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>{user.name}</span>
									<span className='truncate text-xs opacity-60'>{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
							<LogOut />
							{t('signOut')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
