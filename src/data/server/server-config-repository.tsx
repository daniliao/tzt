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
            key: config.key, 
            value: config.value, 
            updatedAt: config.updatedAt
        })
        .from(config)
        .where(eq(config.key, query.key))
        .then(rows => rows[0] as { key: string; value: string | null; updatedAt: Date } | undefined);

        if (!existingConfig) {
            return this.create(item);
        }

        const updatedConfig = {
            key: existingConfig.key,
            value: item.value,
            updatedAt: new Date().toISOString()
        };

        await db.update(config)
            .set({
                value: item.value,
                updatedAt: new Date()
            })
            .where(eq(config.key, query.key));

        return updatedConfig;
    }

    async delete(query: Record<string, string>): Promise<boolean> {
        const db = (await this.db());
        const result = await db.delete(config)
            .where(eq(config.key, query.key))
            .returning();
        return result.length > 0;
    }

    async findAll(): Promise<ConfigDTO[]> {
        const db = (await this.db());
        const rows = await db.select({
            key: config.key,
            value: config.value,
            updatedAt: config.updatedAt
        })
        .from(config);
        
        return rows.map(row => ({
            key: row.key,
            value: row.value,
            updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : getCurrentTS()
        }));
    }
}