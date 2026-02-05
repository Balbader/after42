CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`email` text NOT NULL UNIQUE,
	`user_role` text(4) DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
