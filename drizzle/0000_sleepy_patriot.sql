CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`date` text NOT NULL,
	`guests` text NOT NULL,
	`note` text,
	`status` text DEFAULT 'requested' NOT NULL,
	`created_at` text NOT NULL
);
