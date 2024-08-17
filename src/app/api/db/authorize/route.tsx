import { databaseAuthorizeRequestSchema, KeyDTO } from "@/data/dto";
import { ***REMOVED***orizeKey } from "@/data/server/server-***REMOVED***-helpers";
import { getErrorMessage, getZedErrorMessage } from "@/lib/utils";
import {SignJWT, jwtVerify, type JWTPayload} from 'jose'

// clear all the database
export async function POST(request: Request) {
    try {
        const jsonRequest = await request.json();
        const validationResult = databaseAuthorizeRequestSchema.safeParse(jsonRequest); // validation
        if (validationResult.success === true) {
            const ***REMOVED***Request = validationResult.data;
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
                .setIssuer('urn:ctt:patient-pad')
                .setAudience('urn:ctt:patient-pad')
                .setExpirationTime('10s')
                .sign(new TextEncoder().encode(process.env.PATIENT_PAD_TOKEN_SECRET || 'Jeipho7ahchue4ahhohsoo3jahmui6Ap'))

                const refreshToken = await new SignJWT(***REMOVED***Payload)
                .setProtectedHeader({ alg })
                .setIssuedAt()
                .setIssuer('urn:ctt:patient-pad')
                .setAudience('urn:ctt:patient-pad')
                .setExpirationTime('8h')
                .sign(new TextEncoder().encode(process.env.PATIENT_PAD_REFRESH_TOKEN_SECRET || 'Am2haivu9teiseejai5Ao6engae8hiuw'))

                return Response.json({
                    message: 'Succesfully Authorized!',
                    data: {
                        encryptedMasterKey: (***REMOVED***Details as KeyDTO).encryptedMasterKey,
                        accessToken:  accessToken,
                        refreshToken: refreshToken
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
