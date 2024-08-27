import ServerFolderRepository from "@/data/server/server-folder-repository";
import ServerRecordRepository from "@/data/server/server-record-repository";
import { ***REMOVED***orizeRequestContext, genericDELETE } from "@/lib/generic-***REMOVED***";

export async function DELETE(request: Request, { params }: { params: { id: number }} ) {
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    const recordLocator = params.id;
    const prRepo = new ServerRecordRepository(requestContext.databaseIdHash);
    const records = await prRepo.findAll( { filter: { folderId: recordLocator } });
    if (records.length > 0) {
        return Response.json({ message: "Cannot delete folder, folder has records. Remove them first", status: 400 }, {status: 400});
    }

    if(!recordLocator){
        return Response.json({ message: "Invalid request, no id provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerFolderRepository(requestContext.databaseIdHash), { id: recordLocator}));
    }
}