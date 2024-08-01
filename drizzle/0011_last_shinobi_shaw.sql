CREATE TABLE `***REMOVED***s` (
	`***REMOVED***LocatorHash` text PRIMARY KEY NOT NULL,	
	`***REMOVED***Hash` text NOT NULL,
	`***REMOVED***HashParams` text NOT NULL,
	`databaseIdHash` text,
	`encryptedMasterKey` text,
	`acl` text,
	`extra` text,
	`expiryDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
