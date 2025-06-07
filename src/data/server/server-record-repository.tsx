import { BaseRepository, IQuery } from "./base-repository"
import { RecordDTO } from "../dto";
import { pool } from '@/data/server/db-provider'
import { getCurrentTS } from "@/lib/utils";
import { records } from "./db-schema";
import { eq, sql } from "drizzle-orm";
import { create } from "./generic-repository";

export default class ServerRecordRepository extends BaseRepository<RecordDTO> {
    private toISOStringIfDate(value: Date | string | null | undefined): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value || getCurrentTS();
    }
    
    async create(item: RecordDTO): Promise<RecordDTO> {
        const db = (await this.db());
        // Convert string timestamps to Date objects for Drizzle
        const drizzleItem = {
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            eventDate: item.eventDate || getCurrentTS()
        };
        const result = await create(drizzleItem, records, db);
        // Convert back to string for DTO
        return {
            ...result,
            createdAt: this.toISOStringIfDate(result.createdAt),
            updatedAt: this.toISOStringIfDate(result.updatedAt),
            eventDate: result.eventDate || getCurrentTS()
        };
    }

    // update folder
    async upsert(query: Record<string, any>, item: RecordDTO): Promise<RecordDTO> { 
        const db = (await this.db());       
        const existingRecord = await db.select({
            id: records.id,
            folderId: records.folderId,
            description: records.description,
            type: records.type,
            title: records.title,
            tags: records.tags,
            json: records.json,
            text: records.text,
            transcription: records.transcription,
            checksum: records.checksum,
            checksumLastParsed: records.checksumLastParsed,
            extra: records.extra,
            attachments: records.attachments,
            eventDate: records.eventDate,
            createdAt: records.createdAt,
            updatedAt: records.updatedAt
        })
        .from(records)
        .where(eq(records.id, query.id))
        .then(rows => rows[0]);

        if (!existingRecord) {
            return this.create(item);
        }

        const updatedRecord: RecordDTO = {
            ...item,
            updatedAt: getCurrentTS()
        };

        await db.update(records)
            .set({
                folderId: updatedRecord.folderId,
                description: updatedRecord.description,
                type: updatedRecord.type,
                title: updatedRecord.title,
                tags: updatedRecord.tags,
                json: updatedRecord.json,
                text: updatedRecord.text,
                transcription: updatedRecord.transcription,
                checksum: updatedRecord.checksum,
                checksumLastParsed: updatedRecord.checksumLastParsed,
                extra: updatedRecord.extra,
                attachments: updatedRecord.attachments,
                eventDate: updatedRecord.eventDate || getCurrentTS(),
                updatedAt: new Date(updatedRecord.updatedAt)
            })
            .where(eq(records.id, query.id));

        return updatedRecord;
    }    

    async delete(query: Record<string, string>): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(records)
            .where(eq(records.id, parseInt(query.id)))
            .returning();
        return result.length > 0;
    }

    async findAll(query?: IQuery): Promise<RecordDTO[]> {
        const db = (await this.db());
        const conditions: any[] = [];

        if (query?.filter) {
            if (query.filter['folderId']) {
                conditions.push(sql`${records.folderId} = ${parseInt(query.filter['folderId'] as string)}`);
            }
        }

        const rows = await db.select({
            id: records.id,
            folderId: records.folderId,
            description: records.description,
            type: records.type,
            title: records.title,
            tags: records.tags,
            json: records.json,
            text: records.text,
            transcription: records.transcription,
            checksum: records.checksum,
            checksumLastParsed: records.checksumLastParsed,
            extra: records.extra,
            attachments: records.attachments,
            eventDate: records.eventDate,
            createdAt: records.createdAt,
            updatedAt: records.updatedAt
        })
        .from(records)
        .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined);

        return rows.map(row => ({
            id: row.id,
            folderId: row.folderId || 0,
            description: row.description || null,
            type: row.type || '',
            title: row.title || null,
            tags: row.tags || null,
            json: row.json ? JSON.stringify(row.json) : null,
            text: row.text || null,
            transcription: row.transcription || null,
            checksum: row.checksum || null,
            checksumLastParsed: row.checksumLastParsed || null,
            extra: row.extra ? JSON.stringify(row.extra) : null,
            attachments: row.attachments ? JSON.stringify(row.attachments) : null,
            eventDate: row.eventDate || getCurrentTS(),
            createdAt: this.toISOStringIfDate(row.createdAt),
            updatedAt: this.toISOStringIfDate(row.updatedAt)
        }));
    }
}