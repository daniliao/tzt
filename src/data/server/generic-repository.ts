import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// create a new record
export async function create<T extends { [***REMOVED***:string]: any }>(item: T, schema: any, db: PostgresJsDatabase): Promise<T> {
    const [returnedItem] = await db.insert(schema).values(item).returning();
    return returnedItem as T;
}