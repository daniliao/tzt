import { BaseRepository } from "./base-repository"
import { ConfigDTO } from "../dto";
import { getCurrentTS } from "@/lib/utils";
import { config } from "./db-schema";
import { eq } from "drizzle-orm/sql";
import { create } from "./generic-repository";

export default class ServerConfigRepository extends BaseRepository<ConfigDTO> {

    // create a new config
    async create(item: ConfigDTO): Promise<ConfigDTO> {
        return create(item, config, await this.db()); // generic implementation
    }

    // update config
    async upsert(query: Record<string, any>, item: ConfigDTO): Promise<ConfigDTO> {      
        const db = (await this.db());  
        const existingConfig = await db.select({ 
            ***REMOVED***: config.***REMOVED***, 
            value: config.value, 
            updatedAt: config.updatedAt
        })
        .from(config)
        .where(eq(config.***REMOVED***, query.***REMOVED***))
        .then(rows => rows[0] as { ***REMOVED***: string; value: string | null; updatedAt: Date } | undefined);

        if (!existingConfig) {
            return this.create(item);
        }

        const updatedConfig = {
            ***REMOVED***: existingConfig.***REMOVED***,
            value: item.value,
            updatedAt: getCurrentTS()
        };

        await db.update(config)
            .set({
                value: item.value,
                updatedAt: new Date(getCurrentTS())
            })
            .where(eq(config.***REMOVED***, query.***REMOVED***));

        return updatedConfig;
    }

    async delete(query: Record<string, string>): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(config)
            .where(eq(config.***REMOVED***, query.***REMOVED***))
            .returning();
        return result.length > 0;
    }

    async findAll(): Promise<ConfigDTO[]> {
        const db = (await this.db());
        const rows = await db.select({
            ***REMOVED***: config.***REMOVED***,
            value: config.value,
            updatedAt: config.updatedAt
        })
        .from(config);
        
        return rows.map(row => ({
            ***REMOVED***: row.***REMOVED***,
            value: row.value,
            updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : getCurrentTS()
        }));
    }
}