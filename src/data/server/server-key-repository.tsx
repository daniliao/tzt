import { BaseRepository } from "./base-repository"
import { KeyDTO } from "../dto";
import { db } from '@/data/server/db-provider'
import { getCurrentTS } from "@/lib/utils";
import { ***REMOVED***s } from "./db-schema";
import { eq } from "drizzle-orm/sql";
import { create } from "./generic-repository";

export default class ServerKeyRepository extends BaseRepository<KeyDTO> {


    // create a new config
    async create(item: KeyDTO): Promise<KeyDTO> {
        return create(item, ***REMOVED***s, db); // generic implementation
    }

    // update config
    async upsert(query:Record<string, any>, item: KeyDTO): Promise<KeyDTO> {        
        let existingKey = db.select({ ***REMOVED***Hash: ***REMOVED***s.***REMOVED***Hash, databaseIdHash: ***REMOVED***s.databaseIdHash, updatedAt: ***REMOVED***s.updatedAt, extra: ***REMOVED***s.extra, acl: ***REMOVED***s.acl, expiryDate: ***REMOVED***s.expiryDate}).from(***REMOVED***s).where(eq(***REMOVED***s.***REMOVED***Hash, query['***REMOVED***Hash'])).get() as KeyDTO
        if (!existingKey) {
            existingKey = await this.create(item)
        } else {
            existingKey = item
            existingKey.updatedAt = getCurrentTS()
            db.update(***REMOVED***s).set(existingKey).where(eq(***REMOVED***s.***REMOVED***Hash, query['***REMOVED***Hash'])).run();
        }
        return Promise.resolve(existingKey as KeyDTO)   
    }

    async delete(query: Record<string, string>): Promise<boolean> {
        return db.delete(***REMOVED***s).where(eq(***REMOVED***s.***REMOVED***Hash, query['***REMOVED***Hash'])).run()
    }

    async findAll(searchParams: Base): Promise<KeyDTO[]> {
        let query = db.select().from(***REMOVED***s).$dynamic

        if(searchParams){
            if(searchParams.hasOwnProperty('databaseIdHash')){
                query.where(eq(***REMOVED***s.databaseIdHash, searchParams['databaseIdHash']))
            }
        return Promise.resolve(query.all() as ConfigDTO[])
    }

}