CREATE TABLE "config" (
	"***REMOVED***" text PRIMARY KEY NOT NULL,
	"value" text,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encryptedAttachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"displayName" text,
	"type" text,
	"url" text,
	"mimeType" text,
	"assignedTo" jsonb,
	"json" jsonb,
	"extra" jsonb,
	"size" integer,
	"storageKey" text,
	"description" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"json" jsonb,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "***REMOVED***s" (
	"***REMOVED***LocatorHash" text PRIMARY KEY NOT NULL,
	"displayName" text,
	"databaseIdHash" text NOT NULL,
	"***REMOVED***Hash" text NOT NULL,
	"***REMOVED***HashParams" text NOT NULL,
	"encryptedMasterKey" text NOT NULL,
	"acl" text,
	"extra" text,
	"expiryDate" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"folderId" integer,
	"description" text,
	"type" text,
	"title" text,
	"tags" text,
	"json" jsonb,
	"text" text,
	"transcription" text,
	"checksum" text,
	"checksumLastParsed" text,
	"extra" jsonb,
	"attachments" jsonb,
	"eventDate" text DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"code" text,
	"***REMOVED***" text,
	"signedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_folderId_folders_id_fk" FOREIGN KEY ("folderId") REFERENCES "public"."folders"("id") ON DELETE no action ON UPDATE no action;