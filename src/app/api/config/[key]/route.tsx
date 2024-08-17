import ServerConfigRepository from "@/data/server/server-config-repository";
import { genericDELETE, ***REMOVED***orizeRequestContext } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { ***REMOVED***: string }}) {
    const recordLocator = params.***REMOVED***;
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    if (requestContext.acl.role !== 'owner') {
        return Response.json({ message: "Owner role is required", status: 401 }, {status: 401});
    }

    if(!recordLocator){
        return Response.json({ message: "Invalid request, no ***REMOVED*** provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerConfigRepository(requestContext.databaseIdHash), { ***REMOVED***: recordLocator}));
    }
}