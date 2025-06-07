ALTER TABLE "stats" ALTER COLUMN "eventName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "promptTokens" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "promptTokens" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "completionTokens" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "completionTokens" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "finishReasons" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "finishReasons" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "createdMonth" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "createdDay" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "createdYear" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "createdHour" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "counter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stats" ALTER COLUMN "counter" DROP NOT NULL;