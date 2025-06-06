import { pgTable, text, integer, serial, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const folders = pgTable('folders', {
    id: serial('id').primaryKey(),
    name: text('name'),
    json: jsonb('json'),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const config = pgTable('config', {
    ***REMOVED***: text('***REMOVED***').primaryKey(),
    value: text('value'),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const ***REMOVED***s = pgTable('***REMOVED***s', {
    ***REMOVED***LocatorHash: text('***REMOVED***LocatorHash').primaryKey(),
    displayName: text('displayName'),
    databaseIdHash: text('databaseIdHash').notNull(),
    ***REMOVED***Hash: text('***REMOVED***Hash').notNull(),
    ***REMOVED***HashParams: text('***REMOVED***HashParams').notNull(),
    encryptedMasterKey: text('encryptedMasterKey').notNull(),
    acl: text('acl'),
    extra: text('extra'),
    expiryDate: timestamp('expiryDate').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
}); 

export const records = pgTable('records', {
    id: serial('id').primaryKey(),
    folderId: integer('folderId').references(() => folders.id),
    description: text('description'),
    type: text('type'),
    title: text('title'),
    tags: text('tags'),
    json: jsonb('json'),
    text: text('text'),
    transcription: text('transcription'),
    checksum: text('checksum'),
    checksumLastParsed: text('checksumLastParsed'),
    extra: jsonb('extra'),
    attachments: jsonb('attachments'),
    eventDate: text('eventDate').notNull().default(''),
    createdAt: timestamp('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const encryptedAttachments = pgTable('encryptedAttachments', {
    id: serial('id').primaryKey(),
    displayName: text('displayName'),
    type: text('type'),
    url: text('url'),
    mimeType: text('mimeType'),
    assignedTo: jsonb('assignedTo'),
    json: jsonb('json'),
    extra: jsonb('extra'),
    size: integer('size'),
    storageKey: text('storageKey'),
    description: text('description'),
    createdAt: timestamp('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const terms = pgTable('terms', {
    id: serial('id').primaryKey(),
    content: text('content'),
    code: text('code'),
    ***REMOVED***: text('***REMOVED***'),
    signature: text('signature'),
    ip: text('ip'),
    ua: text('ua'),
    name: text('name'),
    email: text('email'),
    signedAt: timestamp('signedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});
