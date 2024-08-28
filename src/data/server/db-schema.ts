import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const folders = sqliteTable('folders', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name'),
    json: text('json', { mode: 'json' }),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});


export const config = sqliteTable('config', {
    ***REMOVED***: text('***REMOVED***', { mode: 'text' }).primaryKey(),
    value: text('value'),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const ***REMOVED***s = sqliteTable('***REMOVED***s', {
    ***REMOVED***LocatorHash: text('***REMOVED***LocatorHash').primaryKey(),
    displayName: text('displayName'),
    databaseIdHash: text('databaseIdHash', { mode: 'text' }).notNull(),
    ***REMOVED***Hash: text('***REMOVED***Hash').notNull(),
    ***REMOVED***HashParams: text('***REMOVED***HashParams').notNull(),
    encryptedMasterKey: text('encryptedMasterKey').notNull(),
    acl: text('acl'),
    extra: text('extra'),
    expiryDate: text('expiryDate').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
}); 

export const records = sqliteTable('records', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    folderId: integer('folderId', { mode: 'number' }).references(() => folders.id),
    description: text('description'),
    type: text('type'),

    title: text('title'),
    tags: text('tags'),
    
    json: text('json', { mode: 'json' }),
    text: text('text'),

    checksum: text('checksum'),
    checksumLastParsed: text('checksumLastParsed'),

    extra: text('extra', { mode: 'json' }),
    attachments: text('attachments', { mode: 'json' }),
    
    createdAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});


export const encryptedAttachments = sqliteTable('encryptedAttachments', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    
    displayName: text('displayName'),
    type: text('type'),
    url: text('url'),
    mimeType: text('mimeType'),

    assignedTo: text('assignedTo', { mode: 'json' }),

    json: text('json', { mode: 'json' }),
    extra: text('extra', { mode: 'json' }),
    size: integer('size', { mode: 'number' }),    


    storageKey: text('storageKey'),
    description: text('description'),
    
    createdAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`)
});
