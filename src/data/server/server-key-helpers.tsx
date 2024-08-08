import { DatabaseAuthorizeRequestDTO, KeyDTO } from "../dto";
import ServerKeyRepository from "./server-***REMOVED***-repository";

export async function ***REMOVED***orizeKey(***REMOVED***Request: DatabaseAuthorizeRequestDTO): Promise<KeyDTO | boolean> {
    const ***REMOVED***Repo = new ServerKeyRepository(***REMOVED***Request.databaseIdHash); // get the user ***REMOVED***
    const existingKeys:KeyDTO[] = await ***REMOVED***Repo.findAll({  filter: { ***REMOVED***LocatorHash: ***REMOVED***Request.***REMOVED***LocatorHash } }); // check if ***REMOVED*** already exists

    if(existingKeys.length === 0) { // this situation theoretically should not happen bc. if database file exists we return out of the function
        return false;      
    } else {
        const isExpired = existingKeys[0].expiryDate ? (new Date(existingKeys[0].expiryDate)).getTime() < Date.now() : false;
        if (existingKeys[0].***REMOVED***Hash !== ***REMOVED***Request.***REMOVED***Hash || isExpired) {    
            return false;
        } else {
            return existingKeys[0];
        }
    }
}