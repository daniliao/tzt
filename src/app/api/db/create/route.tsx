import { KeyDTO, DatabaseCreateRequestDTO, databaseCreateRequestSchema } from "@/data/dto";
import { maintenance } from "@/data/server/db-provider";
import ServerFolderRepository from "@/data/server/server-folder-repository";
import ServerKeyRepository from "@/data/server/server-***REMOVED***-repository";
import { ***REMOVED***orizeSaasContext } from "@/lib/generic-***REMOVED***";
import { getCurrentTS, getErrorMessage, getZedErrorMessage } from "@/lib/utils";
import { NextRequest, userAgent } from "next/server";
import { features } from "process";



// This is the UC01 implementation of https://github.com/CatchTheTornado/doctor-dok/issues/65
export async function POST(request: NextRequest) {
    try {
        const jsonRequest = await request.json();
        const saasContext = await ***REMOVED***orizeSaasContext(request); // ***REMOVED***orize SaaS context
        if (!saasContext.hasAccess) {
            return Response.json({
                message: saasContext.error,
                status: 403
            });
        }

        if (saasContext.isSaasMode) {
            if (saasContext.saasContex?.currentQuota) {
                if(saasContext.saasContex?.currentQuota.allowedDatabases <= saasContext.saasContex?.currentUsage.usedDatabases) {
                    return Response.json({
                        message: 'You have reached the limit of databases you can create. Please upgrade your plan.',
                        status: 403
                    });
                }
            }
        }


        const validationResult = databaseCreateRequestSchema.safeParse(jsonRequest); // validation
        if (validationResult.success === true) {
            const ***REMOVED***CreateRequest = validationResult.data;

            if (await maintenance.checkIfDatabaseExists(***REMOVED***CreateRequest.databaseIdHash)) { // to not avoid overriding database fiels
                return Response.json({
                    message: 'Database already exists. Please select different Id.',
                    data: { 
                        databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash
                    },
                    status: 409
                });            
            } else {
                const now = new Date();
                const nowISO = now.toISOString();
                await maintenance.createDatabaseManifest(***REMOVED***CreateRequest.databaseIdHash, {
                    databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash,
                    createdAt: nowISO,
                    creator: {
                        ip: request.ip,
                        ua: userAgent(request).ua,
                        geo: request.geo
                    }                
                });
                const folderRepo = new ServerFolderRepository(***REMOVED***CreateRequest.databaseIdHash); // creating a first User Key                     
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
                        displayName: '',
                        ***REMOVED***LocatorHash: ***REMOVED***CreateRequest.***REMOVED***LocatorHash,
                        ***REMOVED***Hash: ***REMOVED***CreateRequest.***REMOVED***Hash,
                        ***REMOVED***HashParams: ***REMOVED***CreateRequest.***REMOVED***HashParams,
                        encryptedMasterKey: ***REMOVED***CreateRequest.encryptedMasterKey,
                        databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash,                
                        acl: JSON.stringify({
                            role: 'owner',
                            features: ['*']
                        }),
                        extra: null,
                        expiryDate: null,
                        updatedAt: nowISO
                    })

                    const firstFolder = folderRepo.create({
                        name: 'General',
                        json: JSON.stringify({
                            name: 'root',
                            type: 'folder',
                            children: []
                        }),
                        updatedAt: nowISO
                    });

                    if (saasContext.isSaasMode) {
                        try {
                            saasContext.***REMOVED***Client?.newDatabase({
                                databaseIdHash: ***REMOVED***CreateRequest.databaseIdHash,
                                createdAt: nowISO
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }

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
