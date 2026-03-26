'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
	const t = useTranslations('language');
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const switchLocale = (next: (typeof routing.locales)[number]) => {
		if (next === locale) return;
		startTransition(() => {
			router.replace(pathname, { locale: next });
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					disabled={pending}
					aria-label={t('label')}
				>
					<Languages className='size-[1.15rem]' />
					<span className='sr-only'>{t('label')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{routing.locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLocale(loc)}
						disabled={loc === locale}
					>
						{t(loc)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
