import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import { db } from '@/db';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { github } from '@/lib/github';
import { headers } from 'next/headers';

export async function GET(
	_request: Request,
	context: { params: Promise<{ forkName: string }> },
) {
	try {
		const { forkName: forkNameParam } = await context.params;
		const forkName = decodeURIComponent(forkNameParam);

		const { session, user } = await authController.getSession(await headers());
		if (!session || !user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const sessionUser = user as User;
		if (sessionUser.role !== 'candidate') {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const [sub] = await db
			.select()
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.githubForkName, forkName),
					eq(candidateSubmission.candidateId, sessionUser.id),
				),
			)
			.limit(1);

		if (!sub) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
			return NextResponse.json({ commits: 0 });
		}

		const total = await github.getCommitCount(forkName);
		const commits = Math.max(0, total - 1);

		return NextResponse.json({ commits });
	} catch {
		return NextResponse.json({ commits: 0 }, { status: 200 });
	}
}
