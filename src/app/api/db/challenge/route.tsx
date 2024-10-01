import { databaseAuthorizeChallengeRequestSchema, ***REMOVED***HashParamsDTOSchema, KeyDTO } from "@/data/dto";
import ServerKeyRepository from "@/data/server/server-***REMOVED***-repository";
import { getErrorMessage, getZedErrorMessage } from "@/lib/utils";


export async function POST(request: Request) {
    try {
        const jsonRequest = await request.json();
        console.log(jsonRequest);
        const validationResult = databaseAuthorizeChallengeRequestSchema.safeParse(jsonRequest); // validation
        if (validationResult.success === true) {
            const ***REMOVED***ChallengeRequest = validationResult.data;
            const ***REMOVED***Repo = new ServerKeyRepository(***REMOVED***ChallengeRequest.databaseIdHash); // get the user ***REMOVED***
            const existingKeys = await ***REMOVED***Repo.findAll({  filter: { ***REMOVED***LocatorHash: ***REMOVED***ChallengeRequest.***REMOVED***LocatorHash } }); // check if ***REMOVED*** already exists

            if(existingKeys.length === 0) { // this situation theoretically should not happen bc. if database file exists we return out of the function
                return Response.json({
                    message: 'Invalid Database Id or Key. Key not found.',
                    status: 401               
                });                    
            } else {
                const khpdValidation = ***REMOVED***HashParamsDTOSchema.safeParse(JSON.parse(existingKeys[0].***REMOVED***HashParams))
                if (!khpdValidation.success) {
                    console.error(khpdValidation);
                    return Response.json({
                        message: getZedErrorMessage(khpdValidation.error),
                        issues: khpdValidation.error.issues,
                        status: 400               
                    });  
                } else {
                    const ***REMOVED***HashParamsObject = khpdValidation.data
                    return Response.json({
                        message: 'Key found. Challenge is ready.',
                        data: ***REMOVED***HashParamsObject,
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
