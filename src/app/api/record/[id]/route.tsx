import ServerRecordRepository from "@/data/server/server-record-repository";
import {  ***REMOVED***orizeRequestContext, genericDELETE } from "@/lib/generic-***REMOVED***";

export async function DELETE(request: Request, { params }: { params: { id: number }} ) {
    const recordLocator = params.id;
    const requestContext = await ***REMOVED***orizeRequestContext(request);

    if(!recordLocator){
        return Response.json({ message: "Invalid request, no id provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerRecordRepository(requestContext.databaseIdHash), { id: recordLocator}));
    }
}