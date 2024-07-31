import ServerConfigRepository from "@/data/server/server-config-repository";
import { genericDELETE, getDatabaseId } from "@/lib/generic-***REMOVED***";

export async function DELETE(request: Request, { params }: { params: { hash: string }} ) {
    const recordLocator = params.hash;
    if(!recordLocator){
        return Response.json({ message: "Invalid request, no ***REMOVED*** provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerConfigRepository(getDatabaseId(request)), { ***REMOVED***: recordLocator}));
    }
}