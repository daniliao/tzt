CREATE TABLE "manifest" (
	"database_id_hash" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"creator_ip" text,
	"creator_ua" text,
	"creator_country" text,
	"creator_city" text,
	"creator_latitude" text,
	"creator_longitude" text
);
