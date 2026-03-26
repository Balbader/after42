import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import { redirect } from '@/i18n/navigation';

export type SessionUserPlain = ReturnType<User['toJSON']>;

export async function requireRole(
	role: 'candidate' | 'recruiter',
): Promise<SessionUserPlain> {
	const { user } = await authController.requireSession(await headers());
	const userPlain = user ? (user as User).toJSON() : null;
	if (!userPlain || userPlain.role !== role) {
		redirect({ href: '/dashboard', locale: await getLocale() });
	}
	return userPlain as SessionUserPlain;
}
