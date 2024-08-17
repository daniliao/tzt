import ServerConfigRepository from "@/data/server/server-config-repository";
import ServerKeyRepository from "@/data/server/server-***REMOVED***-repository";
import { ***REMOVED***orizeRequestContext, genericDELETE } from "@/lib/generic-***REMOVED***";

export async function DELETE(request: Request, { params }: { params: { ***REMOVED***: string }} ) {
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    if (requestContext.acl.role !== 'owner') {
        return Response.json({ message: "Owner role is required", status: 401 }, {status: 401});
    }

    const recordLocator = params.***REMOVED***;
    if(!recordLocator){
        return Response.json({ message: "Invalid request, no ***REMOVED*** provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerKeyRepository(requestContext.databaseIdHash), { ***REMOVED***LocatorHash: recordLocator}));
    }
}