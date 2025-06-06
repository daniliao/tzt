import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { TermDTO } from "../dto";
import { getCurrentTS } from "@/lib/utils";
import { terms } from "./db-schema";
import { eq } from "drizzle-orm";
import { create } from "./generic-repository";

export default class ServerTermRepository extends BaseRepository<TermDTO> {
    async create(item: TermDTO): Promise<TermDTO> {
        const db = (await this.db());
        return create(item, terms, db); // generic implementation
    }

    async upsert(query: Record<string, any>, item: TermDTO): Promise<TermDTO> {        
        const db = (await this.db());
        const existingTerm = await db.select({
            id: terms.id,
            content: terms.content,
            code: terms.code,
            ***REMOVED***: terms.***REMOVED***,
            signature: terms.signature,
            ip: terms.ip,
            ua: terms.ua,
            name: terms.name,
            email: terms.email,
            signedAt: terms.signedAt
        })
        .from(terms)
        .where(eq(terms.***REMOVED***, query['***REMOVED***']))
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
            .where(eq(terms.***REMOVED***, query['***REMOVED***']));

        return updatedTerm;
    }

    async delete(query: IFilter): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(terms)
            .where(eq(terms.***REMOVED***, query['***REMOVED***']))
            .returning();
        return result.length > 0;
    }

    async findAll(query?: IQuery): Promise<TermDTO[]> {
        const db = (await this.db());
        const rows = await db.select({
            id: terms.id,
            content: terms.content,
            code: terms.code,
            ***REMOVED***: terms.***REMOVED***,
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
            ***REMOVED***: row.***REMOVED*** || '',
            signature: row.signature || '',
            ip: row.ip || null,
            ua: row.ua || null,
            name: row.name || null,
            email: row.email || null,
            signedAt: row.signedAt instanceof Date ? row.signedAt.toISOString() : getCurrentTS()
        }));
    }
}