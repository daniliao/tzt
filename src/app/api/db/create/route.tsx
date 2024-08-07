import { KeyDTO, DatabaseCreateRequestDTO, databaseCreateRequestSchema } from "@/data/dto";
import { maintenance } from "@/data/server/db-provider";
import ServerKeyRepository from "@/data/server/server-***REMOVED***-repository";
import { getCurrentTS, getErrorMessage, getZedErrorMessage } from "@/lib/utils";
import { NextRequest, userAgent } from "next/server";



// This is the UC01 implementation of https://github.com/CatchTheTornado/patient-pad/issues/65
export async function POST(request: NextRequest) {
    try {
        const jsonRequest = await request.json();
        console.log(jsonRequest);
        const validationResult = databaseCreateRequestSchema.safeParse(jsonRequest); // validation
        if (validationResult.success === true) {
            const ***REMOVED***CreateRequest = validationResult.data;

            if (maintenance.checkIfDatabaseExists(***REMOVED***CreateRequest.databaseIdHash)) { // to not avoid overriding database fiels
                return Response.json({
                    message: 'Database already exists. Please select different Id.',
                    data: { 
                        databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash
                    },
                    status: 409
                });            
            } else {
                await maintenance.createDatabaseManifest(***REMOVED***CreateRequest.databaseIdHash, {
                    databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash,
                    createdAt: getCurrentTS(),
                    creator: {
                        ip: request.ip,
                        ua: userAgent(request).ua,
                        geo: request.geo
                    }                
                });                     
                const ***REMOVED***Repo = new ServerKeyRepository(***REMOVED***CreateRequest.databaseIdHash); // creating a first User Key
                const existingKeys = await ***REMOVED***Repo.findAll({  filter: { databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash } }); // check if ***REMOVED*** already exists

                if(existingKeys.length > 0) { // this situation theoretically should not happen bc. if database file exists we return out of the function
                    return Response.json({
                        message: 'User ***REMOVED*** already exists. Please select different Id.',
                        data: { 
                            databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash
                        },
                        status: 409               
                    });                    
                } else {
                    const firstUserKey = ***REMOVED***Repo.create({
                        ***REMOVED***LocatorHash: ***REMOVED***CreateRequest.***REMOVED***LocatorHash,
                        ***REMOVED***Hash: ***REMOVED***CreateRequest.***REMOVED***Hash,
                        ***REMOVED***HashParams: ***REMOVED***CreateRequest.***REMOVED***HashParams,
                        encryptedMasterKey: ***REMOVED***CreateRequest.encryptedMasterKey,
                        databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash,                
                        acl: null,
                        extra: null,
                        expiryDate: null,
                        updatedAt: getCurrentTS(),
                    })
                    // TODO: ***REMOVED***orize + return access ***REMOVED*** (?)

                    return Response.json({
                        message: 'Database created successfully. Now you can log in.',
                        data: null,
                        status: 200
                    });                    
                }         
            }
        } else {
            console.error(validationResult);
            return Response.json({
                message: getZedErrorMessage(validationResult.error),
                issues: validationResult.error.issues,
                status: 400               
            });
        }
    } catch (e) {
        console.error(e);
        return Response.json({
            message: getErrorMessage(e),
            error: e,
            status: 500
        });
    }    

}
