import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { KeyDTO } from "../dto";
import { pool } from '@/data/server/db-provider'
import { getCurrentTS } from "@/lib/utils";
import { ***REMOVED***s } from "./db-schema";
import { eq, and, sql } from "drizzle-orm";
import { create } from "./generic-repository";

export type KeysQuery = IQuery & { 
    filter: { ***REMOVED***Hash?: string, databaseIdHash?: string }
}

export default class ServerKeyRepository extends BaseRepository<KeyDTO> {
    // create a new ***REMOVED***
    async create(item: KeyDTO): Promise<KeyDTO> {
        const db = (await this.db());
        return create(item, ***REMOVED***s, db); // generic implementation
    }

    // update ***REMOVED***
    async upsert(query: Record<string, any>, item: KeyDTO): Promise<KeyDTO> {        
        const db = (await this.db());
        const existingKey = await db.select({
            ***REMOVED***LocatorHash: ***REMOVED***s.***REMOVED***LocatorHash,
            ***REMOVED***Hash: ***REMOVED***s.***REMOVED***Hash,
            databaseIdHash: ***REMOVED***s.databaseIdHash,
            updatedAt: ***REMOVED***s.updatedAt,
            extra: ***REMOVED***s.extra,
            acl: ***REMOVED***s.acl,
            expiryDate: ***REMOVED***s.expiryDate,
            displayName: ***REMOVED***s.displayName,
            ***REMOVED***HashParams: ***REMOVED***s.***REMOVED***HashParams,
            encryptedMasterKey: ***REMOVED***s.encryptedMasterKey
        })
        .from(***REMOVED***s)
        .where(eq(***REMOVED***s.***REMOVED***LocatorHash, query['***REMOVED***LocatorHash']))
        .then(rows => rows[0]);

        if (!existingKey) {
            return this.create(item);
        }

        // Update the ***REMOVED*** with new values
        const updatedKey: KeyDTO = {
            ...item,
            updatedAt: getCurrentTS()
        };

        await db.update(***REMOVED***s)
            .set({
                displayName: updatedKey.displayName,
                ***REMOVED***Hash: updatedKey.***REMOVED***Hash,
                ***REMOVED***HashParams: updatedKey.***REMOVED***HashParams,
                databaseIdHash: updatedKey.databaseIdHash,
                encryptedMasterKey: updatedKey.encryptedMasterKey,
                acl: updatedKey.acl,
                extra: updatedKey.extra,
                expiryDate: updatedKey.expiryDate ? new Date(updatedKey.expiryDate) : null,
                updatedAt: new Date(updatedKey.updatedAt)
            })
            .where(eq(***REMOVED***s.***REMOVED***LocatorHash, query['***REMOVED***LocatorHash']));

        // Return the updated ***REMOVED***
        return updatedKey;
    }

    async delete(query: IFilter): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(***REMOVED***s)
            .where(eq(***REMOVED***s.***REMOVED***LocatorHash, query['***REMOVED***LocatorHash']))
            .returning();
        return result.length > 0;
    }

    async findAll(query: KeysQuery): Promise<KeyDTO[]> {
        const db = (await this.db());
        const conditions: any[] = [];

        if (query?.filter) {
            if (query.filter.databaseIdHash) {
                conditions.push(sql`${***REMOVED***s.databaseIdHash} = ${query.filter.databaseIdHash}`);
            }
            if (query.filter.***REMOVED***Hash) {
                conditions.push(sql`${***REMOVED***s.***REMOVED***Hash} = ${query.filter.***REMOVED***Hash}`);
            }
            if (query.filter.***REMOVED***LocatorHash) {
                conditions.push(sql`${***REMOVED***s.***REMOVED***LocatorHash} = ${query.filter.***REMOVED***LocatorHash}`);
            }
        }

        const rows = await db.select({
            ***REMOVED***LocatorHash: ***REMOVED***s.***REMOVED***LocatorHash,
            ***REMOVED***Hash: ***REMOVED***s.***REMOVED***Hash,
            databaseIdHash: ***REMOVED***s.databaseIdHash,
            updatedAt: ***REMOVED***s.updatedAt,
            extra: ***REMOVED***s.extra,
            acl: ***REMOVED***s.acl,
            expiryDate: ***REMOVED***s.expiryDate,
            displayName: ***REMOVED***s.displayName,
            ***REMOVED***HashParams: ***REMOVED***s.***REMOVED***HashParams,
            encryptedMasterKey: ***REMOVED***s.encryptedMasterKey
        })
        .from(***REMOVED***s)
        .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined);

        return rows.map(row => ({
            displayName: row.displayName || '',
            ***REMOVED***LocatorHash: row.***REMOVED***LocatorHash,
            ***REMOVED***Hash: row.***REMOVED***Hash,
            ***REMOVED***HashParams: row.***REMOVED***HashParams,
            databaseIdHash: row.databaseIdHash,
            encryptedMasterKey: row.encryptedMasterKey,
            expiryDate: row.expiryDate ? row.expiryDate.toISOString() : null,
            updatedAt: row.updatedAt.toISOString(),
            acl: row.acl || undefined,
            extra: row.extra || undefined
        }));
    }
}