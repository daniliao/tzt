import ServerEncryptedAttachmentRepository from "@/data/server/server-encryptedattachment-repository";
import { ***REMOVED***orizeRequestContext, genericDELETE } from "@/lib/generic-***REMOVED***";
import { StorageService } from "@/lib/storage-service";
export const dynamic = 'force-dynamic' // defaults to auto


export async function DELETE(request: Request, { params }: { params: { id: string }} ) {
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    const storageService = new StorageService(requestContext.databaseIdHash);

    const recordLocator = params.id;
    if(!recordLocator){
        return Response.json({ message: "Invalid request, no id provided within request url", status: 400 }, {status: 400});
    } else { 
        const repo = new ServerEncryptedAttachmentRepository(requestContext.databaseIdHash)
        const recordBeforeDelete = await repo.findOne({ storageKey: recordLocator });
        if (!recordBeforeDelete) {
            return Response.json({ message: "Record not found", status: 404 }, {status: 404});
        }
        const ***REMOVED***Response = await genericDELETE(request, repo, { storageKey: recordLocator});
        if(***REMOVED***Response.status === 200){
            storageService.deleteAttachment(recordLocator);
        }
        return Response.json(***REMOVED***Response);
    }
}

export async function GET(request: Request, { params }: { params: { id: string }}) {
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    const storageService = new StorageService(requestContext.databaseIdHash);

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    const fileContent = await storageService.readAttachment(params.id) // TODO: add streaming
    return new Response(fileContent, { headers });
}