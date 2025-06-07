import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const stats = pgTable('stats', {
    id: serial('id').primaryKey(),
    eventName: text('eventName'),
    promptTokens: integer('promptTokens'),
    completionTokens: integer('completionTokens'),
    finishReasons: text('finishReasons'),
    createdAt: timestamp('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    createdMonth: integer('createdMonth'), // for easier grouping
    createdDay: integer('createdDay'),
    createdYear: integer('createdYear'),
    createdHour: integer('createdHour'),
    counter: integer('counter')
}, (table) => {
    return {
        // Add indexes for the commonly queried date fields
        dateIdx: sql`CREATE INDEX IF NOT EXISTS stats_date_idx ON ${table} (createdYear, createdMonth, createdDay, createdHour)`,
        eventIdx: sql`CREATE INDEX IF NOT EXISTS stats_event_idx ON ${table} (eventName)`,
        // Add unique constraint for upsert
        uniqueStats: sql`CREATE UNIQUE INDEX IF NOT EXISTS stats_unique_idx ON ${table} (createdHour, createdDay, createdMonth, createdYear, eventName)`
    };
});

