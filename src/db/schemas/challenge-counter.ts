import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Atomic counter for per-challenge candidate sequence numbers.
 *
 * Usage (in a transaction):
 *   INSERT OR IGNORE INTO challenge_counter (challenge_id, seq) VALUES (?, 0);
 *   UPDATE challenge_counter SET seq = seq + 1 WHERE challenge_id = ?;
 *   SELECT seq FROM challenge_counter WHERE challenge_id = ?;
 *
 * The resulting seq is the sequenceNum for the new candidate_submission row.
 * This prevents race conditions when multiple candidates submit simultaneously.
 */
export const challengeCounter = sqliteTable('challenge_counter', {
	challengeId: text('challenge_id').primaryKey(),
	seq: integer('seq').notNull().default(0),
});
