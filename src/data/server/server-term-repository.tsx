import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { TermDTO } from "../dto";
import { getCurrentTS } from "@/lib/utils";
import { terms } from "./db-schema";
import { eq } from "drizzle-orm";
import { create } from "./generic-repository";

export default class ServerTermRepository extends BaseRepository<TermDTO> {
    private toISOStringIfDate(value: Date | string | null | undefined): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value || getCurrentTS();
    }

    async create(item: TermDTO): Promise<TermDTO> {
        const db = (await this.db());
        // Convert string timestamps to Date objects for Drizzle
        const drizzleItem = {
            ...item,
            signedAt: item.signedAt ? new Date(item.signedAt) : new Date()
        };
        const result = await create(drizzleItem, terms, db);
        // Convert back to string for DTO
        return {
            ...result,
            signedAt: this.toISOStringIfDate(result.signedAt)
        };
    }

    async upsert(query: Record<string, any>, item: TermDTO): Promise<TermDTO> {        
        const db = (await this.db());
        const existingTerm = await db.select({
            id: terms.id,
            content: terms.content,
            code: terms.code,
            key: terms.key,
            signature: terms.signature,
            ip: terms.ip,
            ua: terms.ua,
            name: terms.name,
            email: terms.email,
            signedAt: terms.signedAt
        })
        .from(terms)
        .where(eq(terms.key, query['key']))
        .then(rows => rows[0]);

        if (!existingTerm) {
            return this.create(item);
        }

        const updatedTerm: TermDTO = {
            ...item,
            signedAt: getCurrentTS()
        };

        await db.update(terms)
            .set({
                content: updatedTerm.content,
                code: updatedTerm.code,
                signature: updatedTerm.signature,
                ip: updatedTerm.ip,
                ua: updatedTerm.ua,
                name: updatedTerm.name,
                email: updatedTerm.email,
                signedAt: new Date(updatedTerm.signedAt)
            })
            .where(eq(terms.key, query['key']));

        return updatedTerm;
    }

    async delete(query: IFilter): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(terms)
            .where(eq(terms.key, query['key']))
            .returning();
        return result.length > 0;
    }

    async findAll(query?: IQuery): Promise<TermDTO[]> {
        const db = (await this.db());
        const rows = await db.select({
            id: terms.id,
            content: terms.content,
            code: terms.code,
            key: terms.key,
            signature: terms.signature,
            ip: terms.ip,
            ua: terms.ua,
            name: terms.name,
            email: terms.email,
            signedAt: terms.signedAt
        })
        .from(terms);
        
        return rows.map(row => ({
            id: row.id,
            content: row.content || '',
            code: row.code || '',
            key: row.key || '',
            signature: row.signature || '',
            ip: row.ip || null,
            ua: row.ua || null,
            name: row.name || null,
            email: row.email || null,
            signedAt: this.toISOStringIfDate(row.signedAt)
        }));
    }
}