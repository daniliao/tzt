import { BaseRepository, IFilter, IQuery } from "./base-repository"
import { KeyDTO } from "../dto";
import { pool } from '@/data/server/db-provider'
import { getCurrentTS } from "@/lib/utils";
import { ***REMOVED***s } from "./db-schema";
import { eq } from "drizzle-orm/sql";
import { create } from "./generic-repository";


export type KeysQuery = IQuery & { 
    filter: { ***REMOVED***Hash?: string, databaseIdHash?: string }
}
export default class ServerKeyRepository extends BaseRepository<KeyDTO> {


    // create a new config
    async create(item: KeyDTO): Promise<KeyDTO> {
        const db = (await this.db());
        return create(item, ***REMOVED***s, db); // generic implementation
    }

    // update config
    async upsert(query:Record<string, any>, item: KeyDTO): Promise<KeyDTO> {        
        const db = (await this.db());
        let existingKey = db.select({ ***REMOVED***LocatorHash: ***REMOVED***s.***REMOVED***LocatorHash, ***REMOVED***Hash: ***REMOVED***s.***REMOVED***Hash, databaseIdHash: ***REMOVED***s.databaseIdHash, updatedAt: ***REMOVED***s.updatedAt, extra: ***REMOVED***s.extra, acl: ***REMOVED***s.acl, expiryDate: ***REMOVED***s.expiryDate}).from(***REMOVED***s).where(eq(***REMOVED***s.***REMOVED***LocatorHash, query['***REMOVED***LocatorHash'])).get() as KeyDTO
        if (!existingKey) {
            existingKey = await this.create(item)
        } else {
            existingKey = item
            existingKey.updatedAt = getCurrentTS()
            db.update(***REMOVED***s).set(existingKey).where(eq(***REMOVED***s.***REMOVED***LocatorHash, query['***REMOVED***LocatorHash'])).run();
        }
        return Promise.resolve(existingKey as KeyDTO)   
    }

    async delete(query: IFilter): Promise<boolean> {
        const db = (await this.db());
        return db.delete(***REMOVED***s).where(eq(***REMOVED***s.***REMOVED***LocatorHash, query['***REMOVED***LocatorHash'])).run().changes > 0
    }

    async findAll(query: KeysQuery): Promise<KeyDTO[]> {
        const db = (await this.db());
        let dbQuery = db.select().from(***REMOVED***s);

        if(query?.filter){
            if(query.filter.databaseIdHash){ 
                dbQuery.where(eq(***REMOVED***s.databaseIdHash, query.filter.databaseIdHash))

            }
            if(query.filter.***REMOVED***Hash){
                dbQuery.where(eq(***REMOVED***s.***REMOVED***Hash, query.filter.***REMOVED***Hash))
            }
            if(query.filter.***REMOVED***LocatorHash){
                dbQuery.where(eq(***REMOVED***s.***REMOVED***LocatorHash, query.filter.***REMOVED***LocatorHash))
            }            
        }

        return Promise.resolve(dbQuery.all() as KeyDTO[])
    }

}