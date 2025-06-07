import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { KeyDTO } from "../dto";
import { pool } from '@/data/server/db-provider'
import { getCurrentTS } from "@/lib/utils";
import { keys } from "./db-schema";
import { eq, and, sql } from "drizzle-orm";
import { create } from "./generic-repository";

export type KeysQuery = IQuery & { 
    filter: { keyHash?: string, databaseIdHash?: string }
}

export default class ServerKeyRepository extends BaseRepository<KeyDTO> {
    private toISOStringIfDate(val: unknown): string {
        return val instanceof Date ? val.toISOString() : (val as string);
    }

    // create a new key
    async create(item: KeyDTO): Promise<KeyDTO> {
        const db = (await this.db());
        // Convert string timestamps to Date objects for Drizzle
        const drizzleItem = {
            ...item,
            updatedAt: new Date(item.updatedAt),
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : null
        };
        const result = await create(drizzleItem, keys, db);
        // Convert back to string for DTO
        return {
            ...result,
            updatedAt: this.toISOStringIfDate(result.updatedAt),
            expiryDate: result.expiryDate ? this.toISOStringIfDate(result.expiryDate) : null
        };
    }

    // update key
    async upsert(query: Record<string, any>, item: KeyDTO): Promise<KeyDTO> {        
        const db = (await this.db());
        const existingKey = await db.select({
            keyLocatorHash: keys.keyLocatorHash,
            keyHash: keys.keyHash,
            databaseIdHash: keys.databaseIdHash,
            updatedAt: keys.updatedAt,
            extra: keys.extra,
            acl: keys.acl,
            expiryDate: keys.expiryDate,
            displayName: keys.displayName,
            keyHashParams: keys.keyHashParams,
            encryptedMasterKey: keys.encryptedMasterKey
        })
        .from(keys)
        .where(eq(keys.keyLocatorHash, query['keyLocatorHash']))
        .then(rows => rows[0]);

        if (!existingKey) {
            return this.create(item);
        }

        // Update the key with new values
        const updatedKey: KeyDTO = {
            ...item,
            updatedAt: new Date().toISOString()
        };

        await db.update(keys)
            .set({
                displayName: updatedKey.displayName,
                keyHash: updatedKey.keyHash,
                keyHashParams: updatedKey.keyHashParams,
                databaseIdHash: updatedKey.databaseIdHash,
                encryptedMasterKey: updatedKey.encryptedMasterKey,
                acl: updatedKey.acl,
                extra: updatedKey.extra,
                expiryDate: updatedKey.expiryDate ? new Date(updatedKey.expiryDate) : null,
                updatedAt: new Date(updatedKey.updatedAt)
            })
            .where(eq(keys.keyLocatorHash, query['keyLocatorHash']));

        // Return the updated key
        return updatedKey;
    }

    async delete(query: IFilter): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(keys)
            .where(eq(keys.keyLocatorHash, query['keyLocatorHash']))
            .returning();
        return result.length > 0;
    }

    async findAll(query: KeysQuery): Promise<KeyDTO[]> {
        const db = (await this.db());
        const conditions = [];

        if (query?.filter) {
            if (query.filter.databaseIdHash) {
                conditions.push(eq(keys.databaseIdHash, query.filter.databaseIdHash));
            }
            if (query.filter.keyHash) {
                conditions.push(eq(keys.keyHash, query.filter.keyHash));
            }
            if (query.filter.keyLocatorHash) {
                conditions.push(eq(keys.keyLocatorHash, query.filter.keyLocatorHash));
            }
        }

        try {
            const rows = await db.select({
                keyLocatorHash: keys.keyLocatorHash,
                keyHash: keys.keyHash,
                databaseIdHash: keys.databaseIdHash,
                updatedAt: keys.updatedAt,
                extra: keys.extra,
                acl: keys.acl,
                expiryDate: keys.expiryDate,
                displayName: keys.displayName,
                keyHashParams: keys.keyHashParams,
                encryptedMasterKey: keys.encryptedMasterKey
            })
            .from(keys)
            .where(conditions.length > 0 ? and(...conditions) : undefined);

            return rows.map(row => ({
                displayName: row.displayName || '',
                keyLocatorHash: row.keyLocatorHash,
                keyHash: row.keyHash,
                keyHashParams: row.keyHashParams,
                databaseIdHash: row.databaseIdHash,
                encryptedMasterKey: row.encryptedMasterKey,
                expiryDate: row.expiryDate ? row.expiryDate.toISOString() : null,
                updatedAt: row.updatedAt.toISOString(),
                acl: row.acl || undefined,
                extra: row.extra || undefined
            }));
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }
}