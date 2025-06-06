import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { and, eq, sql } from "drizzle-orm";
import { AggregatedStatsDTO, AuditDTO, StatDTO } from "../dto";
import { stats } from "./db-schema-stats";
import currentPricing from '@/data/ai/pricing.json'
import { create } from "./generic-repository";
import { audit } from "./db-schema-audit";
import { desc, asc } from 'drizzle-orm';


export default class ServerAuditRepository extends BaseRepository<AuditDTO> {
    async create(item: AuditDTO): Promise<AuditDTO> {
        const db = (await this.db());
        return create(item, audit, db); // generic implementation
    }

    async upsert(query: Record<string, any>, log: AuditDTO): Promise<AuditDTO> {        
        const db = (await this.db());
        const newLog = await this.create(log);
        return newLog;
    }

    async findAll(query: IQuery): Promise<AuditDTO[]> {
        const db = (await this.db());
        const rows = await db.select()
            .from(audit)
            .offset(query.offset ?? 0)
            .limit(query.limit ?? 100)
            .orderBy(desc(audit.createdAt));
        
        return rows.map(row => ({
            id: row.id,
            ip: row.ip || undefined,
            ua: row.ua || undefined,
            ***REMOVED***LocatorHash: row.***REMOVED***LocatorHash || undefined,
            databaseIdHash: row.databaseIdHash || undefined,
            recordLocator: row.recordLocator || undefined,
            encryptedDiff: row.encryptedDiff || undefined,
            eventName: row.eventName || undefined,
            createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt
        }));
    }

    // Helper method to get audit logs for a specific month
    async findByMonth(year: number, month: number): Promise<AuditDTO[]> {
        const db = (await this.db());
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        const rows = await db.select()
            .from(audit)
            .where(
                and(
                    sql`${audit.createdAt} >= ${startDate}`,
                    sql`${audit.createdAt} < ${endDate}`
                )
            )
            .orderBy(desc(audit.createdAt));
        
        return rows.map(row => ({
            id: row.id,
            ip: row.ip || undefined,
            ua: row.ua || undefined,
            ***REMOVED***LocatorHash: row.***REMOVED***LocatorHash || undefined,
            databaseIdHash: row.databaseIdHash || undefined,
            recordLocator: row.recordLocator || undefined,
            encryptedDiff: row.encryptedDiff || undefined,
            eventName: row.eventName || undefined,
            createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt
        }));
    }
}