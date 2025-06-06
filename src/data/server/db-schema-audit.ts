import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Create a partitioned table by month
export const audit = pgTable('audit', {
    id: integer('id').primaryKey(),
    ip: text('ip'),
    ua: text('ua'),
    ***REMOVED***LocatorHash: text('***REMOVED***LocatorHash'),
    databaseIdHash: text('databaseIdHash'),
    recordLocator: text('recordLocator'),
    encryptedDiff: text('diff'),
    eventName: text('eventName'),
    createdAt: timestamp('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => {
    return {
        // Add a partition ***REMOVED*** based on the month of createdAt
        partitionKey: sql`date_trunc('month', ${table.createdAt})`
    };
});

