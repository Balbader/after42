'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, usePathname } from '@/i18n/navigation';

const BREADCRUMB_KEYS = [
	'dashboard',
	'challenge',
	'create',
	'my-challenges',
	'profile',
	'chat',
	'candidate',
	'company',
	'challenges',
	'submissions',
	'candidates',
	'submit',
] as const;

type BreadcrumbKey = (typeof BREADCRUMB_KEYS)[number];

function isBreadcrumbKey(s: string): s is BreadcrumbKey {
	return (BREADCRUMB_KEYS as readonly string[]).includes(s);
}

function titleCaseSegment(segment: string): string {
	return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DynamicBreadcrumb() {
	const pathname = usePathname();
	const t = useTranslations('breadcrumb');
	const segments = pathname.split('/').filter(Boolean);

	const getLabel = (segment: string) =>
		isBreadcrumbKey(segment) ? t(segment) : titleCaseSegment(segment);

	if (
		segments.length === 0 ||
		(segments.length === 1 && segments[0] === 'dashboard')
	) {
		return (
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>{t('dashboard')}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className='hidden md:block'>
					<BreadcrumbLink asChild>
						<Link href='/dashboard'>{t('dashboard')}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{segments.map((segment, i) => {
					const path = '/' + segments.slice(0, i + 1).join('/');
					const label = getLabel(segment);
					const isLast = i === segments.length - 1;

					return (
						<React.Fragment key={path}>
							<BreadcrumbSeparator className='hidden md:block' />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={path}>{label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
