CREATE TABLE `***REMOVED***s` (
	`***REMOVED***LocatorHash` text PRIMARY KEY NOT NULL,
	`databaseIdHash` text NOT NULL,
	`***REMOVED***Hash` text NOT NULL,
	`***REMOVED***HashParams` text NOT NULL,
	`encryptedMasterKey` text NOT NULL,
	`acl` text,
	`extra` text,
	`expiryDate` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
