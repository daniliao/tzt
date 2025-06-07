import { BaseRepository } from "./base-repository"
import { EncryptedAttachmentDTO } from "../dto";
import { getCurrentTS } from "@/lib/utils";
import { encryptedAttachments } from "./db-schema";
import { eq } from "drizzle-orm";
import { create } from "./generic-repository";

export default class ServerEncryptedAttachmentRepository extends BaseRepository<EncryptedAttachmentDTO> {
    private toISOStringIfDate(value: Date | string | null | undefined): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value || getCurrentTS();
    }
    
    async create(item: EncryptedAttachmentDTO): Promise<EncryptedAttachmentDTO> {
        const db = (await this.db());
        // Convert string timestamps to Date objects for Drizzle
        const drizzleItem = {
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
        };
        const result = await create(drizzleItem, encryptedAttachments, db);
        // Convert back to string for DTO
        return {
            ...result,
            createdAt: this.toISOStringIfDate(result.createdAt),
            updatedAt: this.toISOStringIfDate(result.updatedAt)
        };
    }

    async delete(query: Record<string, any>): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(encryptedAttachments)
            .where(eq(encryptedAttachments.storageKey, query.storageKey))
            .returning();
        return result.length > 0;
    }

    // update folder
    async upsert(query: Record<string, any>, item: EncryptedAttachmentDTO): Promise<EncryptedAttachmentDTO> {        
        const db = (await this.db());
        let existingRecord: EncryptedAttachmentDTO | null = null;
        
        if (query.id) {
            const rows = await db.select()
                .from(encryptedAttachments)
                .where(eq(encryptedAttachments.id, query.id));
            if (rows[0]) {
                const row = rows[0];
                existingRecord = {
                    id: row.id,
                    displayName: row.displayName || '',
                    description: row.description,
                    mimeType: row.mimeType,
                    type: row.type,
                    json: row.json as string,
                    extra: row.extra as string,
                    size: row.size || 0,
                    storageKey: row.storageKey || '',
                    createdAt: this.toISOStringIfDate(row.createdAt),
                    updatedAt: this.toISOStringIfDate(row.updatedAt),
                    assignedTo: row.assignedTo as string
                };
            }
        }

        if (!existingRecord) {
            return this.create(item);
        }

        const updatedRecord = {
            ...item,
            updatedAt: getCurrentTS()
        };

        // Convert string dates to Date objects for PostgreSQL
        const dbUpdateData = {
            displayName: item.displayName,
            description: item.description,
            mimeType: item.mimeType,
            type: item.type,
            json: item.json,
            extra: item.extra,
            size: item.size,
            storageKey: item.storageKey,
            assignedTo: item.assignedTo,
            updatedAt: new Date(updatedRecord.updatedAt)
        };

        await db.update(encryptedAttachments)
            .set(dbUpdateData)
            .where(eq(encryptedAttachments.id, query.id));

        return updatedRecord;
    }    

    async findAll(): Promise<EncryptedAttachmentDTO[]> {
        const db = (await this.db());
        const rows = await db.select()
            .from(encryptedAttachments);
        
        return rows.map(row => ({
            id: row.id,
            displayName: row.displayName || '',
            description: row.description,
            mimeType: row.mimeType,
            type: row.type,
            json: row.json as string,
            extra: row.extra as string,
            size: row.size || 0,
            storageKey: row.storageKey || '',
            createdAt: this.toISOStringIfDate(row.createdAt),
            updatedAt: this.toISOStringIfDate(row.updatedAt),
            assignedTo: row.assignedTo as string
        }));
    }
}