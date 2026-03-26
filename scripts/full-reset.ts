/**
 * Full database reset — drops all rows from every table, then re-seeds.
 *
 * Run: pnpm full-reset
 *
 * Order matters: child tables (FK dependants) are deleted before parents.
 */
import { sql } from 'drizzle-orm';
import { db } from '@/db';

const TABLES_IN_DELETE_ORDER = [
	// children first
	'candidate_submission',
	'challenge_counter',
	'challenge',
	'job_post',
	'programmer',
	'recruiter',
	'company',
	// better-auth tables
	'session',
	'account',
	'verification',
	'user',
];

async function fullReset() {
	console.log('\n🗑️  Deleting all rows…\n');

	for (const table of TABLES_IN_DELETE_ORDER) {
		const result = await db.run(sql.raw(`DELETE FROM "${table}"`));
		const count = result.rowsAffected ?? 0;
		console.log(`  ✓ ${table} — ${count} row${count === 1 ? '' : 's'} deleted`);
	}

	console.log('\n✅ Database is empty.\n');
	console.log('🌱 Re-seeding…\n');

	// Dynamic import so seed runs after the wipe is complete
	await import('./seed');

	console.log('\n🎉 Full reset complete.\n');
}

fullReset().catch((err) => {
	console.error('❌ Full reset failed:', err);
	process.exit(1);
});
