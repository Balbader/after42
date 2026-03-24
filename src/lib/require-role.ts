import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type SessionUserPlain = ReturnType<User['toJSON']>;

export async function requireRole(
	role: 'candidate' | 'recruiter',
): Promise<SessionUserPlain> {
	const { user } = await authController.requireSession(await headers());
	const userPlain = user ? (user as User).toJSON() : null;
	if (!userPlain || userPlain.role !== role) {
		redirect('/dashboard');
	}
	return userPlain;
}
