import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { pool } from "./db-provider";
import { SQL, sql } from "drizzle-orm";

// import all interfaces
export type IFilter = Record<string, any> | any;

export interface IQuery {
    limit?: number;
    offset?: number;
    sort?: Record<string, any>;
    filter?: IFilter;
    search?: string;
}

export interface IWrite<T> {
    create(item: T): Promise<T>;
    update(query: Record<string, any>, item: T): Promise<T>;
    delete(query: Record<string, any>): Promise<boolean>;
}

export interface IRead<T> {
    findAll(query: IQuery): Promise<T[]>;
    findOne(query: IFilter): Promise<T | null>;
}

// that class only can be extended
export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
    databaseId: string;
    databaseSchema: string;
    databasePartition: string;

    constructor(databaseId: string, databaseSchema: string = '', databasePartition: string = '') {
        this.databaseId = databaseId;
        this.databaseSchema = databaseSchema;
        this.databasePartition = databasePartition;
    }

    async db(): Promise<NeonHttpDatabase> {
        return (await pool)(this.databaseId, this.databaseSchema, this.databasePartition, false);
    }

    protected buildWhereClause(filter: IFilter): SQL {
        const conditions: SQL[] = [];
        for (const [***REMOVED***, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
                conditions.push(sql`${***REMOVED***} = ${value}`);
            }
        }
        return conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;
    }

    protected buildOrderByClause(sort?: Record<string, any>): SQL {
        if (!sort) return sql``;
        const orders: SQL[] = [];
        for (const [***REMOVED***, value] of Object.entries(sort)) {
            orders.push(sql`${***REMOVED***} ${value === 'desc' ? sql`DESC` : sql`ASC`}`);
        }
        return orders.length > 0 ? sql`ORDER BY ${sql.join(orders, sql`, `)}` : sql``;
    }

    protected buildLimitOffsetClause(limit?: number, offset?: number): SQL {
        const clauses: SQL[] = [];
        if (limit) clauses.push(sql`LIMIT ${limit}`);
        if (offset) clauses.push(sql`OFFSET ${offset}`);
        return clauses.length > 0 ? sql`${sql.join(clauses, sql` `)}` : sql``;
    }

    async create(item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    async update(query: Record<string, any>, item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    async upsert(query: Record<string, any>, item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    async delete(query: Record<string, any>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async findAll(query?: IQuery): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    async findOne(query: IFilter): Promise<T | null> {
        const records = await this.findAll({ filter: query, limit: 1 });
        return records.length > 0 ? records[0] : null;
    }
}