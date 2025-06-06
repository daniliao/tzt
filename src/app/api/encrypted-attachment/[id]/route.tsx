import ServerEncryptedAttachmentRepository from "@/data/server/server-encryptedattachment-repository";
import { ***REMOVED***orizeRequestContext, genericDELETE } from "@/lib/generic-***REMOVED***";
import { StorageService } from "@/lib/storage-service";
import { getErrorMessage } from "@/lib/utils";

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
        try {
            const ***REMOVED***Response = await genericDELETE(request, repo, { storageKey: recordLocator});
            if(***REMOVED***Response.status === 200){
                await storageService.deleteAttachment(recordLocator);
            }
            return Response.json(***REMOVED***Response);
        } catch (error) {
            console.error("Error deleting attachment from Azure Blob storage:", error);
            return Response.json({ 
                message: getErrorMessage(error), 
                status: 500,
                error 
            }, { status: 500 });
        }
    }
}

export async function GET(request: Request, { params }: { params: { id: string }}) {
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    const storageService = new StorageService(requestContext.databaseIdHash);

    try {
        const fileContent = await storageService.readAttachment(params.id);
        if (!fileContent) {
            return Response.json({ message: "File not found", status: 404 }, { status: 404 });
        }

        const headers = new Headers();
        headers.append('Content-Type', 'application/octet-stream');
        headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', '0');

        return new Response(fileContent, { headers });
    } catch (error) {
        console.error("Error reading attachment from Azure Blob storage:", error);
        return Response.json({ 
            message: getErrorMessage(error), 
            status: 500,
            error 
        }, { status: 500 });
    }
}