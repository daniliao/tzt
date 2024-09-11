CREATE TABLE `terms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text,
	`code` text,
	`***REMOVED***` text,
	`signature` text,
	`ip` text,
	`ua` text,
	`name` text,
	`email` text,
	`signedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);