/**
 * Seed script — creates test users, job posts, challenges, and submissions.
 *
 * Run: pnpm seed
 * Idempotent: deletes existing seed data before re-inserting.
 */
import { eq, inArray, like } from 'drizzle-orm';
import { db } from '@/db';
import { user, session, account } from '@/db/schemas/schema';
import { jobPost } from '@/db/schemas/job-post';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { challengeCounter } from '@/db/schemas/challenge-counter';
import { auth } from '@/lib/auth';

// ─── Seed users ──────────────────────────────────────────────────────────────

const SEED_PASSWORD = 'Seed1234!';

const SEED_USERS = [
	{
		name: 'Sarah Chen',
		email: 'sarah.chen@after42.dev',
		role: 'recruiter' as const,
		dateOfBirth: new Date('1990-06-15').getTime(),
	},
	{
		name: 'Alex Rivera',
		email: 'alex.rivera@after42.dev',
		role: 'candidate' as const,
		dateOfBirth: new Date('1998-03-22').getTime(),
	},
	{
		name: 'Jordan Patel',
		email: 'jordan.patel@after42.dev',
		role: 'candidate' as const,
		dateOfBirth: new Date('1999-11-08').getTime(),
	},
	{
		name: 'Morgan Kim',
		email: 'morgan.kim@after42.dev',
		role: 'candidate' as const,
		dateOfBirth: new Date('2000-01-30').getTime(),
	},
];

const SEED_EMAILS = SEED_USERS.map((u) => u.email);

// ─── Job post data ───────────────────────────────────────────────────────────

const JOB_POST = {
	id: 'seed-jp-001',
	title: 'Senior Full-Stack Engineer',
	company: 'TechCorp',
	description:
		'We are looking for a senior full-stack engineer to join our product team. You will work on our real-time analytics platform, building features that serve thousands of concurrent users. The ideal candidate has strong experience with React, Node.js, and relational databases.',
	location: 'Remote (EU)',
	remote: true,
	type: 'full-time' as const,
	experienceLevel: 'senior' as const,
	requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
	niceToHaveSkills: ['WebSocket', 'Redis', 'Docker', 'CI/CD'],
	responsibilities: [
		'Design and implement new product features end-to-end',
		'Mentor junior engineers and review pull requests',
		'Participate in system design and architecture decisions',
		'Improve application performance and reliability',
	],
	salaryMin: 120000,
	salaryMax: 160000,
	salaryCurrency: 'EUR',
	originalFileName: 'techcorp-senior-fullstack.pdf',
	originalFileType: 'application/pdf',
	processingStatus: 'completed' as const,
};

// ─── Challenge data ──────────────────────────────────────────────────────────

const CHALLENGE = {
	id: 'seed-ch-001',
	title: 'Build a Real-Time Dashboard',
	seniority_level: 'senior',
	tech_stack: 'React, Node.js, TypeScript, PostgreSQL',
	location_country: 'Remote',
	location_city: 'EU',
	remote: true,
	job_type: 'full-time',
	engineering_category: 'full-stack',
	salary_range_min: 120000,
	salary_range_max: 160000,
	currency: 'EUR',
	equity: false,
	description:
		'Build a real-time analytics dashboard that displays live metrics from a WebSocket feed. The dashboard should handle reconnection gracefully and display historical data.',
	jobPostId: 'seed-jp-001',
	challengeContent: {
		readme: `# Real-Time Analytics Dashboard

## Overview
Build a real-time analytics dashboard that visualises live metrics from a WebSocket feed.

## Requirements
1. **Live feed** — Connect to the provided WebSocket endpoint and display incoming data points as they arrive.
2. **Historical view** — Fetch and render the last 24 hours of data from the REST API on initial load.
3. **Reconnection** — If the WebSocket drops, implement exponential backoff with jitter. Show a non-blocking status indicator.
4. **Filtering** — Users can filter by metric type (CPU, memory, network) and time range.
5. **Responsive** — Must work on desktop (≥1024px) and tablet (≥768px).

## Tech constraints
- React 18+ with TypeScript
- No charting libraries — roll your own SVG or Canvas rendering
- State management of your choice
- Include at least 5 meaningful tests

## Evaluation criteria
- Code organisation and separation of concerns
- Real-time data handling
- Error handling and edge cases
- TypeScript type safety
- Test quality and coverage

## Getting started
\`\`\`bash
npm install
npm run dev    # starts the mock WebSocket + REST server on :4000
npm run start  # starts your dashboard on :3000
\`\`\`

You have **72 hours** from fork time. Good luck!`,
		evaluationCriteria: [
			'Code organisation and separation of concerns',
			'Real-time data handling with WebSocket or SSE',
			'Error handling and edge cases',
			'TypeScript type safety',
			'Test coverage for critical paths',
		],
	},
	githubRepoName: 'challenge-seed-001',
	status: 'active',
};

// ─── Submissions data ────────────────────────────────────────────────────────

function makeSubmissions(candidateIds: Record<string, string>) {
	const now = new Date();
	const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
	const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
	const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

	return [
		{
			id: 'seed-sub-001',
			challengeId: 'seed-ch-001',
			candidateId: candidateIds['alex.rivera@after42.dev'],
			sequenceNum: 1,
			githubForkName: 'alex-rivera-challenge-seed-001',
			status: 'scored',
			code: '// submitted code placeholder',
			score: 87,
			recommendation: 'recommend',
			recommendationNote:
				'Strong implementation with clean architecture. Minor gaps in reconnection test coverage, but overall demonstrates senior-level proficiency.',
			aiReport: {
				strengths: [
					'Clean component architecture with proper separation of concerns',
					'Effective use of WebSocket with automatic reconnection and backoff',
					'Comprehensive error boundaries and graceful degradation patterns',
					'Strong TypeScript usage with discriminated unions for message types',
				],
				gaps: [
					'Missing unit tests for WebSocket reconnection logic',
					'No pagination for historical data endpoint (loads all 24h at once)',
				],
			},
			interviewGuide: [
				{
					question:
						'Walk me through your WebSocket reconnection strategy. What happens if the server is down for 5 minutes?',
					expected_answer:
						'Should describe exponential backoff with jitter, maximum retry cap, and user-visible status indicator. Bonus: mention circuit breaker pattern.',
					focus_area: 'System resilience',
				},
				{
					question:
						'How would you handle a scenario where the WebSocket feed sends 10,000 data points per second?',
					expected_answer:
						'Should mention throttling/debouncing renders, virtual scrolling for the chart, requestAnimationFrame batching, and potentially Web Workers for data processing.',
					focus_area: 'Performance',
				},
				{
					question:
						'Your historical data endpoint currently loads all 24h of data at once. How would you improve this?',
					expected_answer:
						'Should describe cursor-based or time-window pagination, progressive loading, and potentially IndexedDB caching for offline support.',
					focus_area: 'Scalability',
				},
				{
					question:
						'If you had another day, what would you add or change?',
					expected_answer:
						'Look for self-awareness about the gaps: reconnection tests, pagination, maybe accessibility improvements or keyboard navigation for the chart.',
					focus_area: 'Self-assessment',
				},
			],
			submittedAt: twoDaysAgo,
			scoredAt: oneDayAgo,
			createdAt: twoDaysAgo,
		},
		{
			id: 'seed-sub-002',
			challengeId: 'seed-ch-001',
			candidateId: candidateIds['jordan.patel@after42.dev'],
			sequenceNum: 2,
			githubForkName: 'jordan-patel-challenge-seed-001',
			status: 'submitted',
			code: '// submitted code placeholder',
			score: null,
			recommendation: null,
			recommendationNote: null,
			aiReport: null,
			interviewGuide: null,
			submittedAt: sixHoursAgo,
			scoredAt: null,
			createdAt: oneDayAgo,
		},
		{
			id: 'seed-sub-003',
			challengeId: 'seed-ch-001',
			candidateId: candidateIds['morgan.kim@after42.dev'],
			sequenceNum: 3,
			githubForkName: 'morgan-kim-challenge-seed-001',
			status: 'forked',
			code: null,
			score: null,
			recommendation: null,
			recommendationNote: null,
			aiReport: null,
			interviewGuide: null,
			submittedAt: null,
			scoredAt: null,
			createdAt: sixHoursAgo,
		},
	];
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

async function cleanup() {
	console.log('Cleaning up existing seed data...');

	// Find seed user IDs
	const seedUsers = await db
		.select({ id: user.id })
		.from(user)
		.where(inArray(user.email, SEED_EMAILS));
	const seedUserIds = seedUsers.map((u) => u.id);

	// Delete in FK-safe order
	await db
		.delete(candidateSubmission)
		.where(like(candidateSubmission.id, 'seed-%'));
	await db
		.delete(challengeCounter)
		.where(like(challengeCounter.challengeId, 'seed-%'));
	await db.delete(challenge).where(like(challenge.id, 'seed-%'));
	await db.delete(jobPost).where(like(jobPost.id, 'seed-%'));

	if (seedUserIds.length > 0) {
		await db
			.delete(session)
			.where(inArray(session.userId, seedUserIds));
		await db
			.delete(account)
			.where(inArray(account.userId, seedUserIds));
		await db.delete(user).where(inArray(user.id, seedUserIds));
	}

	console.log(
		`  Removed ${seedUserIds.length} users and associated data.\n`,
	);
}

// ─── Create users via Better-auth API ────────────────────────────────────────

async function createUsers(): Promise<Record<string, string>> {
	console.log('Creating seed users...');
	const now = Date.now();
	const emailToId: Record<string, string> = {};

	for (const u of SEED_USERS) {
		try {
			const result = await auth.api.signUpEmail({
				body: {
					name: u.name,
					email: u.email,
					password: SEED_PASSWORD,
					role: u.role,
					dateOfBirth: u.dateOfBirth,
					termsAcceptedAt: now,
					privacyPolicyAcceptedAt: now,
				},
			});

			// The result contains the user object — extract the ID
			const created = result as { user?: { id: string } };
			if (!created.user?.id) {
				throw new Error(`signUpEmail returned no user for ${u.email}`);
			}
			emailToId[u.email] = created.user.id;

			// Mark email as verified so the user can sign in immediately
			await db
				.update(user)
				.set({ emailVerified: true })
				.where(eq(user.email, u.email));

			console.log(`  ✓ ${u.name} (${u.role}) — ${u.email}`);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			console.error(`  ✗ Failed to create ${u.email}: ${msg}`);
			throw err;
		}
	}

	console.log('');
	return emailToId;
}

// ─── Seed domain data ────────────────────────────────────────────────────────

async function seedData(emailToId: Record<string, string>) {
	const recruiterId = emailToId['sarah.chen@after42.dev'];
	const now = new Date();

	// Job post
	console.log('Creating job post...');
	await db.insert(jobPost).values({
		...JOB_POST,
		recruiterId,
		createdAt: now,
		updatedAt: now,
	});
	console.log(`  ✓ ${JOB_POST.title} at ${JOB_POST.company}\n`);

	// Challenge
	console.log('Creating challenge...');
	await db.insert(challenge).values({
		...CHALLENGE,
		creatorId: recruiterId,
		createdAt: now,
		updatedAt: now,
	});
	console.log(`  ✓ ${CHALLENGE.title}\n`);

	// Submissions
	console.log('Creating candidate submissions...');
	const submissions = makeSubmissions(emailToId);
	for (const sub of submissions) {
		await db.insert(candidateSubmission).values({
			...sub,
			updatedAt: sub.createdAt,
		});
		console.log(
			`  ✓ Candidate #${sub.sequenceNum} — ${sub.status}${sub.score ? ` (score: ${sub.score})` : ''}`,
		);
	}
	console.log('');

	// Challenge counter
	console.log('Setting challenge counter...');
	await db.insert(challengeCounter).values({
		challengeId: 'seed-ch-001',
		seq: 3,
	});
	console.log('  ✓ seed-ch-001 → seq 3\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
	console.log('\n🌱 after42 seed script\n');
	console.log('═'.repeat(50));

	await cleanup();
	const emailToId = await createUsers();
	await seedData(emailToId);

	console.log('═'.repeat(50));
	console.log('Done! Sign in with any of these accounts:\n');
	for (const u of SEED_USERS) {
		console.log(`  ${u.email} / ${SEED_PASSWORD} (${u.role})`);
	}
	console.log('');
}

main()
	.catch((err) => {
		console.error('Seed failed:', err);
		process.exit(1);
	})
	.then(() => process.exit(0));
