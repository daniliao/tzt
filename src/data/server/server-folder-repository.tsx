import { BaseRepository } from "./base-repository"
import { FolderDTO } from "../dto";
import { pool } from '@/data/server/db-provider'
import { folders } from "./db-schema";
import { eq } from "drizzle-orm";
import { create } from "./generic-repository";

export default class ServerFolderRepository extends BaseRepository<FolderDTO> {

    // create a new patinet
    async create(item: FolderDTO): Promise<FolderDTO> {
        const db = (await this.db());
        return create(item, folders, db); // generic implementation
    }

    // update folder
    async upsert(query:Record<string, any>, item: FolderDTO): Promise<FolderDTO> {        
        const db = (await this.db());
        let existingFolder = await db.select().from(folders).where(eq(folders.id, query.id)).then(rows => rows[0]);
        if (!existingFolder) {
            return this.create(item);
        } else {
            await db.update(folders).set({ name: item.name, json: item.json }).where(eq(folders.id, query.id));
            // Re-fetch the updated row to get the latest updatedAt
            const updated = await db.select().from(folders).where(eq(folders.id, query.id)).then(rows => rows[0]);
            return {
                id: updated.id,
                name: updated.name as string,
                json: typeof updated.json === 'string' || updated.json === null ? updated.json : JSON.stringify(updated.json),
                updatedAt: this.toISOStringIfDate(updated.updatedAt)
            };
        }
    }    

    async delete(query: Record<string, string>): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(folders).where(eq(folders.id, parseInt(query.id))).returning();
        return result.length > 0;
    }

    async findAll(): Promise<FolderDTO[]> {
        const db = (await this.db());
        const rows = await db.select({
            id: folders.id,
            name: folders.name,
            updatedAt: folders.updatedAt,
            json: folders.json
        }).from(folders);
        return rows.map(row => ({
            id: row.id,
            name: row.name as string,
            json: typeof row.json === 'string' || row.json === null ? row.json : JSON.stringify(row.json),
            updatedAt: this.toISOStringIfDate(row.updatedAt)
        }));
    }

    private toISOStringIfDate(val: unknown): string {
        return val instanceof Date ? val.toISOString() : (val as string);
    }

}