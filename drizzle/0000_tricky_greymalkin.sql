CREATE TABLE "audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" text,
	"ua" text,
	"keyLocatorHash" text,
	"databaseIdHash" text,
	"recordLocator" text,
	"diff" text,
	"eventName" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config" (
	"key" text PRIMARY KEY NOT NULL,
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
CREATE TABLE "keys" (
	"keyLocatorHash" text PRIMARY KEY NOT NULL,
	"displayName" text,
	"databaseIdHash" text NOT NULL,
	"keyHash" text NOT NULL,
	"keyHashParams" text NOT NULL,
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
CREATE TABLE "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventName" text,
	"promptTokens" integer,
	"completionTokens" integer,
	"finishReasons" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdMonth" integer,
	"createdDay" integer,
	"createdYear" integer,
	"createdHour" integer,
	"counter" integer
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"code" text,
	"key" text,
	"signature" text,
	"ip" text,
	"ua" text,
	"name" text,
	"email" text,
	"signedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stats_unique_idx" ON "stats" ("createdHour", "createdDay", "createdMonth", "createdYear", "eventName");
--> statement-breakpoint
CREATE INDEX "stats_date_idx" ON "stats" ("createdYear", "createdMonth", "createdDay", "createdHour");
--> statement-breakpoint
CREATE INDEX "stats_event_idx" ON "stats" ("eventName");
--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_folderId_folders_id_fk" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE no action ON UPDATE no action;
