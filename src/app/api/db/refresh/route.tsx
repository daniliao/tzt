import { DatabaseAuthorizeRequestDTO, databaseRefreshRequestSchema, KeyDTO } from "@/data/dto";
import { ***REMOVED***orizeKey } from "@/data/server/server-***REMOVED***-helpers";
import { getErrorMessage, getZedErrorMessage } from "@/lib/utils";
import {SignJWT, jwtVerify, type JWTPayload} from 'jose'

// clear all the database
export async function POST(request: Request) {
    try {
        const jsonRequest = await request.json();
        const validationResult = databaseRefreshRequestSchema.safeParse(jsonRequest); // validation
        if (validationResult.success === true) {

            const jwtToken = validationResult.data.refreshToken;
            const ***REMOVED***Data = await jwtVerify<DatabaseAuthorizeRequestDTO>(jwtToken, new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET || 'Am2haivu9teiseejai5Ao6engae8hiuw'))
            const ***REMOVED***Request = {
                databaseIdHash: ***REMOVED***Data.payload.databaseIdHash,
                ***REMOVED***Hash: ***REMOVED***Data.payload.***REMOVED***Hash,
                ***REMOVED***LocatorHash: ***REMOVED***Data.payload.***REMOVED***LocatorHash                
            };
            const ***REMOVED***Details = await ***REMOVED***orizeKey(***REMOVED***Request);

            if (!***REMOVED***Details) { // this situation theoretically should not happen bc. if database file exists we return out of the function
                return Response.json({
                    message: 'Invalid Database Id or Key. Key not found.',
                    status: 401               
                });                    
            } else {

                const alg = 'HS256'
                const ***REMOVED***Payload = { databaseIdHash: ***REMOVED***Request.databaseIdHash, ***REMOVED***Hash: ***REMOVED***Request.***REMOVED***Hash, ***REMOVED***LocatorHash: ***REMOVED***Request.***REMOVED***LocatorHash }
                const accessToken = await new SignJWT(***REMOVED***Payload)
                .setProtectedHeader({ alg })
                .setIssuedAt()
                .setIssuer('urn:ctt:doctor-dok')
                .setAudience('urn:ctt:doctor-dok')
                .setExpirationTime('15m')
                .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_TOKEN_SECRET || 'Jeipho7ahchue4ahhohsoo3jahmui6Ap'))

                const refreshToken = await new SignJWT(***REMOVED***Payload)
                .setProtectedHeader({ alg })
                .setIssuedAt()
                .setIssuer('urn:ctt:doctor-dok')
                .setAudience('urn:ctt:doctor-dok')
                .setExpirationTime('8h')
                .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET || 'Am2haivu9teiseejai5Ao6engae8hiuw'))

                return Response.json({
                    message: 'Succesfully Refreshed!',
                    data: {
                        accessToken:  accessToken,
                        refreshToken: refreshToken,
                    },
                    status: 200
                });                    
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
