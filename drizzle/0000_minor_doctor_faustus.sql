CREATE TABLE IF NOT EXISTS "config" (
	"***REMOVED***" text PRIMARY KEY NOT NULL,
	"value" text,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "encryptedAttachments" (
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
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"json" jsonb,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "***REMOVED***s" (
	"***REMOVED***LocatorHash" text PRIMARY KEY NOT NULL,
	"displayName" text,
	"databaseIdHash" text NOT NULL,
	"***REMOVED***Hash" text NOT NULL,
	"***REMOVED***HashParams" text NOT NULL,
	"encryptedMasterKey" text NOT NULL,
	"acl" text,
	"extra" text,
	"expiryDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "records" (
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
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"code" text,
	"***REMOVED***" text,
	"signature" text,
	"ip" text,
	"ua" text,
	"name" text,
	"email" text,
	"signedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'records_folderId_folders_id_fk'
    ) THEN
        ALTER TABLE "records" ADD CONSTRAINT "records_folderId_folders_id_fk" 
        FOREIGN KEY ("folderId") REFERENCES "folders"("id") 
        ON DELETE no action ON UPDATE no action;
    END IF;
END $$;