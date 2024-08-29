import { EncryptedAttachmentDTO, EncryptedAttachmentDTOSchema } from "@/data/dto";
import ServerEncryptedAttachmentRepository from "@/data/server/server-encryptedattachment-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { StorageService } from "@/lib/storage-service";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


// Rest of the code

export async function PUT(request: NextRequest, response: NextResponse) {
    if (request.headers.get("Content-Type") === "application/json") {
        const inputJson = await request.json();
        return await handlePUTRequest(inputJson, request, response);
    } else {
        const formData = await request.formData();
        return await handlePUTRequest(JSON.parse(formData.get("attachmentDTO") as string), request, response, formData.get("file") as File);
    }
}

async function handlePUTRequest(inputJson: any, request: NextRequest, response: NextResponse, file?: File) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);

    const storageService = new StorageService(requestContext.databaseIdHash);
    let ***REMOVED***Result = await genericPUT<EncryptedAttachmentDTO>(
        inputJson,
        EncryptedAttachmentDTOSchema,
        new ServerEncryptedAttachmentRepository(requestContext.databaseIdHash),
        'id'
    );
    if (***REMOVED***Result.status === 200) { // validation went OK, now we can store the file
        if (file) { // file could be not uploaded in case of metadata update
            try {
                const savedAttachment: EncryptedAttachmentDTO = ***REMOVED***Result.data as EncryptedAttachmentDTO;
                storageService.saveAttachment(file, savedAttachment.storageKey);
            } catch (e) {
                console.error("Error saving attachment", e);
                ***REMOVED***Result.status = 500;
                ***REMOVED***Result.message = getErrorMessage(e);
                ***REMOVED***Result.error = e;
            }
        }
    }
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<EncryptedAttachmentDTO>(request, new ServerEncryptedAttachmentRepository(requestContext.databaseIdHash)));
}
