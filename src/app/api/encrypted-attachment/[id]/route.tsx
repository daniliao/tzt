import ServerEncryptedAttachmentRepository from "@/data/server/server-encryptedattachment-repository";
import { genericDELETE, ***REMOVED***orizeDatabaseIdHash } from "@/lib/generic-***REMOVED***";
import { StorageService } from "@/lib/storage-service";
export const dynamic = 'force-dynamic' // defaults to auto


export async function DELETE(request: Request, { params }: { params: { id: number }} ) {
    const storageService = new StorageService(await ***REMOVED***orizeDatabaseIdHash(request));

    const recordLocator = params.id;
    if(!recordLocator){
        return Response.json({ message: "Invalid request, no id provided within request url", status: 400 }, {status: 400});
    } else { 
        const ***REMOVED***Response = await genericDELETE(request, new ServerEncryptedAttachmentRepository(await ***REMOVED***orizeDatabaseIdHash(request)), { id: recordLocator});
        if(***REMOVED***Response.status === 200){
            storageService.deleteAttachment(***REMOVED***Response.data.storageKey);
        }
        return Response.json(***REMOVED***Response);
    }
}

export async function GET(request: Request, { params }: { params: { id: string }}) {
    const storageService = new StorageService(await ***REMOVED***orizeDatabaseIdHash(request));

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    const fileContent = await storageService.readAttachment(params.id) // TODO: add streaming
    return new Response(fileContent, { headers });
}