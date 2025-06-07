import { pgTable, text, integer, serial, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { stats } from "./db-schema-stats";

export const folders = pgTable('folders', {
    id: serial('id').primaryKey(),
    name: text('name'),
    json: jsonb('json'),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const config = pgTable('config', {
    key: text('key').primaryKey(),
    value: text('value'),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const keys = pgTable('keys', {
    keyLocatorHash: text('keyLocatorHash').primaryKey(),
    displayName: text('displayName'),
    databaseIdHash: text('databaseIdHash').notNull(),
    keyHash: text('keyHash').notNull(),
    keyHashParams: text('keyHashParams').notNull(),
    encryptedMasterKey: text('encryptedMasterKey').notNull(),
    acl: text('acl'),
    extra: text('extra'),
    expiryDate: timestamp('expiryDate').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const records = pgTable('records', {
    id: serial('id').primaryKey(),
    folderId: integer('folderId'),
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
    key: text('key'),
    signature: text('signature'),
    ip: text('ip'),
    ua: text('ua'),
    name: text('name'),
    email: text('email'),
    signedAt: timestamp('signedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const audit = pgTable('audit', {
    id: serial('id').primaryKey(),
    ip: text('ip'),
    ua: text('ua'),
    keyLocatorHash: text('keyLocatorHash'),
    databaseIdHash: text('databaseIdHash'),
    recordLocator: text('recordLocator'),
    diff: text('diff'),
    eventName: text('eventName'),
    createdAt: timestamp('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export { stats };
