CREATE TABLE `candidate_submission` (
	`id` text PRIMARY KEY,
	`challenge_id` text NOT NULL,
	`candidate_id` text NOT NULL,
	`sequence_num` integer NOT NULL,
	`github_fork_name` text NOT NULL,
	`status` text DEFAULT 'forked' NOT NULL,
	`code` text,
	`score` integer,
	`recommendation` text,
	`recommendation_note` text,
	`ai_report` text,
	`interview_guide` text,
	`submitted_at` integer,
	`scored_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `challenge_counter` (
	`challenge_id` text PRIMARY KEY,
	`seq` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `challenge` ADD `job_post_id` text;--> statement-breakpoint
ALTER TABLE `challenge` ADD `creator_id` text;--> statement-breakpoint
ALTER TABLE `challenge` ADD `challenge_content` text;--> statement-breakpoint
ALTER TABLE `challenge` ADD `github_repo_name` text;--> statement-breakpoint
ALTER TABLE `challenge` ADD `status` text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
CREATE INDEX `submission_challenge_idx` ON `candidate_submission` (`challenge_id`);--> statement-breakpoint
CREATE INDEX `submission_candidate_idx` ON `candidate_submission` (`candidate_id`);--> statement-breakpoint
CREATE INDEX `submission_challenge_score_idx` ON `candidate_submission` (`challenge_id`,`score`);--> statement-breakpoint
CREATE INDEX `challenge_job_post_idx` ON `challenge` (`job_post_id`);--> statement-breakpoint
CREATE INDEX `challenge_creator_idx` ON `challenge` (`creator_id`);