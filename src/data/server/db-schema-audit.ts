import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Create a partitioned table by month
export const audit = pgTable('audit', {
    id: integer('id').primaryKey(),
    ip: text('ip'),
    ua: text('ua'),
    keyLocatorHash: text('keyLocatorHash'),
    databaseIdHash: text('databaseIdHash'),
    recordLocator: text('recordLocator'),
    diff: text('diff'),
    eventName: text('eventName'),
    createdAt: timestamp('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => {
    return {
        // Add a partition key based on the month of createdAt
        partitionKey: sql`date_trunc('month', ${table.createdAt})`
    };
});

