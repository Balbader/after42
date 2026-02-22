CREATE TABLE `job_post` (
	`id` text PRIMARY KEY,
	`recruiter_id` text NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`description` text NOT NULL,
	`location` text,
	`remote` integer DEFAULT false,
	`type` text NOT NULL,
	`experience_level` text NOT NULL,
	`required_skills` text NOT NULL,
	`nice_to_have_skills` text DEFAULT '[]',
	`responsibilities` text DEFAULT '[]',
	`salary_min` integer,
	`salary_max` integer,
	`salary_currency` text,
	`original_file_name` text NOT NULL,
	`original_file_type` text NOT NULL,
	`processing_status` text DEFAULT 'completed' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `challenge` ADD `seniority_level` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `tech_stack` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `location_country` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `location_city` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `remote` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `job_type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `salary_range_min` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `salary_range_max` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `currency` text NOT NULL;--> statement-breakpoint
ALTER TABLE `challenge` ADD `yes_no` integer DEFAULT false NOT NULL;